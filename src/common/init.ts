import { FromWorkerData, ToWorkerData } from "./types";

export function init(RenderWorker: new () => Worker): void {
  function render(width: number, height: number) {
    return new Promise<Uint8ClampedArray>((resolve) => {
      const cpuCount = navigator.hardwareConcurrency || 1;
      const workerPool: Worker[] = [];
      for (let i = 0; i < cpuCount; i++) {
        workerPool.push(new RenderWorker());
      }
      const aspectRatio = width / height;
      const result = new Uint8ClampedArray(width * height * 4);

      let completedRows = 0;
      function handleRowCompletion(row: number, rowData: Uint8ClampedArray) {
        result.set(rowData, row * width * 4);
        completedRows++;
        if (completedRows === height) {
          workerPool.forEach((worker) => worker.terminate());
          resolve(result);
        }
      }

      let currentRow = 0;

      function assignWork(worker: Worker) {
        if (currentRow >= height) return;

        const row = currentRow++;
        const data: ToWorkerData = { row, width, height, aspectRatio };
        worker.postMessage(data);

        worker.onmessage = (event: MessageEvent<FromWorkerData>) => {
          handleRowCompletion(
            event.data.row,
            new Uint8ClampedArray(event.data.data)
          );
          assignWork(worker);
        };
      }

      workerPool.forEach((worker) => assignWork(worker));
    });
  }

  window.addEventListener("load", () => {
    function resetCSS(element: HTMLElement) {
      element.style.margin = "0";
      element.style.padding = "0";
      element.style.width = "100%";
      element.style.height = "100%";
    }

    resetCSS(document.documentElement);
    resetCSS(document.body);

    const canvas = document.createElement("canvas");
    resetCSS(canvas);
    document.body.appendChild(canvas);

    let running = false;
    function current(): [width: number, height: number] {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = Math.floor(document.body.clientWidth * pixelRatio);
      const height = Math.floor(document.body.clientHeight * pixelRatio);
      return [width, height];
    }
    async function draw(width: number, height: number) {
      const imageData = new ImageData(
        await render(width, height),
        width,
        height
      );
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.putImageData(imageData, 0, 0);
    }
    async function invalidate() {
      if (running) {
        return;
      }
      running = true;
      let [width, height] = current();
      await draw(width, height);
      while (current()[0] !== width || current()[1] !== height) {
        [width, height] = current();
        await draw(width, height);
      }
      running = false;
    }

    function addListener() {
      const mediaQuery = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`
      );
      mediaQuery.addEventListener("change", invalidate);
      return mediaQuery;
    }
    let mediaQuery = addListener();
    const observer = new MutationObserver(() => {
      const newMediaQuery = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`
      );
      if (newMediaQuery.media !== mediaQuery.media) {
        mediaQuery.removeEventListener("change", invalidate);
        mediaQuery = addListener();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
    });

    window.addEventListener("resize", invalidate);

    invalidate();
  });
}
