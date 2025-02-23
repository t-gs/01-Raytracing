/// <reference types="vite/client" />

import { init } from "./common/init";
import MyWorker from "./worker?worker";

init(MyWorker);
