export class Chart implements IChart {
    draw(): void {
        throw new Error("Method not implemented.");
    }
}

export interface IChart {
    draw(): void;
}