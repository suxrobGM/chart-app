abstract class Chart {
    protected readonly canvas: HTMLCanvasElement;
    protected readonly ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    abstract draw(): void;

    public randomColor(seed: number): string {
        if (seed < 1) {
            seed = 1;
        }
        const hue = seed * 137.508; // using golden angle approximation
        return `hsl(${hue}, 100%, 75%)`;
    }
}

class PieChart extends Chart {
    private readonly _data: PieChartData[];

    constructor(canvasElement: HTMLCanvasElement, data: PieChartData[]) {
        super(canvasElement);
        this._data = data;
    }

    public draw() {
        let totalValue = 0;

        this._data.forEach(i => {
            totalValue += i.value;
        });

        let startAngle = 0;
        let colorIndex = 1;

        for (const data of this._data) {
            const val = data.value;
            const sliceAngle = 2 * Math.PI * val / totalValue;
            const endAngle = startAngle + sliceAngle;
            const color = this.randomColor(colorIndex);
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const radius = Math.min(centerX, centerY);

            this.drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color);
            this.drawPieLabel(val, totalValue, startAngle, sliceAngle);

            startAngle += sliceAngle;
            colorIndex++;
        }
    }

    private drawPieLabel(value: number, totalValue: number, startAngle: number, sliceAngle: number) {
        const pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
        const labelX = this.canvas.width / 2 + (pieRadius / 2) * Math.cos(startAngle + sliceAngle / 2);
        const labelY = this.canvas.height / 2 + (pieRadius / 2) * Math.sin(startAngle + sliceAngle / 2);

        const labelText = Math.round(100 * value / totalValue);
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 20px Arial";
        this.ctx.fillText(labelText + "%", labelX, labelY);
    }

    private drawPieSlice(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

class LineChart extends Chart {
    private readonly _data: LineChartData[];
    private readonly _padding: number;
    private readonly _pointRadius: number;
    private _maxX: number;
    private _minX: number;
    private _maxY: number;
    private _minY: number;

    constructor(canvasElement: HTMLCanvasElement, data: LineChartData[]) {
        super(canvasElement);
        this._data = data;
        this._maxX = 0;
        this._minX = 0;
        this._maxY = 0;
        this._minY = 0;
        this._padding = 10;
        this._pointRadius = 5;
    }

    public draw() {
        this.drawX();
        this.drawY();
        //this._data.forEach(i => {
        //    this.drawCategory(i);
        //});
    }

    private drawCategory(data: LineChartData) {
        const xValues = this.getValuesX(data.points);
        const yValues = this.getValuesY(data.points);
        const maxX = this.getMax(xValues);
        const minX = this.getMin(xValues);
        const maxY = this.getMax(yValues);
        const minY = this.getMin(yValues);

        if (maxX > this._maxX) {
            this._maxX = maxX;
        }
        if (minX < this._minX) {
            this._minX = minX;
        }
        if (maxY > this._maxY) {
            this._maxY = maxY;
        }
        if (minY < this._minY) {
            this._minY = minY;
        }
    }

    private drawX() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.drawLine(0, height, width, height, 2);
    }

    private drawY() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.drawLine(0, height, 0, 0, 2);
    }

    private drawLine(startX: number, startY: number, endX: number, endY: number, lineWidth = 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
    }

    private getMax(values: number[]): number {
        let max = values[0];

        values.forEach(i => {
            if (i > max) {
                max = i;
            }
        });

        return max;
    }

    private getMin(values: number[]): number {
        let min = values[0];

        values.forEach(i => {
            if (i < min) {
                min = i;
            }
        });

        return min;
    }

    private getValuesX(values: Point[]): number[] {
        const xValues = new Array<number>();
        values.forEach(i => {
            xValues.push(i.x);
        });
        return xValues;
    }

    private getValuesY(values: Point[]): number[] {
        const yValues = new Array<number>();
        values.forEach(i => {
            yValues.push(i.y);
        });
        return yValues;
    }

    private getUnitValue(maxValue: number, minValue: number) {
        const range = maxValue - minValue;

    }
}

type PieChartData = {
    category: string;
    value: number;
}

type LineChartData = {
    category: string;
    points: Point[];
}

type Point = {
    x: number;
    y: number;
}