/// <reference path="../filePath.d.ts"/>
module dyRt{
    export interface IObserver extends IDisposable{
        next(value:any);
        error(error:any);
        completed();
    }
}
