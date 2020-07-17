export declare namespace Events {
    function attach(event: string, callback: Function): void;
    function fire(event: string, args?: any[]): void;
    function remove(event: string, callback?: Function): void;
    function dom(element: any, event: string, callback: Function): any;
}
