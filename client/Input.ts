export type OnKeyDownCallback = (event: KeyboardEvent) => void;

export class Input {
    private _activeKeys: Set<string> = new Set();
    private _keyDownEvents: Map<string, Set<OnKeyDownCallback>> = new Map();

    public mousePosition: { x: number, y: number } = { x:0, y: 0 };

    constructor() {
        window.addEventListener("keydown", this._keyDown.bind(this));
        window.addEventListener("keyup", this._keyUp.bind(this));
        window.addEventListener("mousemove", this._mouseMove.bind(this));
    }

    private _keyDown(event: KeyboardEvent) {
        let key = event.key.toLowerCase();

        this._activeKeys.add(key);

        let callbacks = this._keyDownEvents.get(key);
        if (callbacks !== undefined) {
            callbacks.forEach(cb => cb(event))
        }
    }

    private _keyUp(event: KeyboardEvent) {
        let key = event.key.toLowerCase();

        this._activeKeys.delete(key);
    }

    private _mouseMove(event: MouseEvent) {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }

    public isKeyDown(key: string): boolean {
        return this._activeKeys.has(key);
    }

    public onKeyDown(key: string, callback: OnKeyDownCallback) {
        if (!this._keyDownEvents.has(key)) this._keyDownEvents.set(key, new Set());
        this._keyDownEvents.get(key)?.add(callback);
    }
}