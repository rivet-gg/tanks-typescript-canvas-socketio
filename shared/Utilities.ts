export class Utilities {
    public static font(size: number, weight: number = 500) {
        return `${weight} ${size}px Big Shoulders Stencil Display`;
    }

    public static lerp(a: number, b: number, t: number): number {
        return (b - a) * t + a;
    }
}