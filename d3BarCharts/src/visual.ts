import "core-js/stable";
import "./../style/visual.less";
import * as d3 from "d3";
import powerbi from "powerbi-visuals-api";

import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbi.DataView;

interface BrandData {
    brand: string;
    pack: string;
    categoryType: string; // "SS mL" o "MS mL"
    entry: number;
    frequency: number;
    upsize: number;
    color: string;
}

export class Visual implements IVisual {
    private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    private host: powerbi.extensibility.visual.IVisualHost;
    private width: number = 0;
    private height: number = 0;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.svg = d3.select(options.element)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");
    }

    public update(options: VisualUpdateOptions): void {
        this.width = options.viewport.width;
        this.height = options.viewport.height;

        this.svg.attr("width", this.width).attr("height", this.height);
        this.svg.selectAll("*").remove();

        const dataView: DataView = options.dataViews[0];

        if (!dataView || !dataView.table || !dataView.table.rows || dataView.table.rows.length === 0) {
            this.svg.append("text")
                .attr("x", this.width / 2)
                .attr("y", this.height / 2)
                .attr("text-anchor", "middle")
                .text("Por favor, añada datos a los campos del visual.");
            return;
        }

        const columns = dataView.table.columns;
        const rows = dataView.table.rows;

        // Encuentra los índices de las columnas por sus roles
        const brandColumn = columns.find(c => c.roles && c.roles.brand);
        const packColumn = columns.find(c => c.roles && c.roles.pack);
        const categoryTypeColumn = columns.find(c => c.roles && c.roles.categoryType); // NUEVO
        const entryMeasure = columns.find(c => c.roles && c.roles.entry);
        const frequencyMeasure = columns.find(c => c.roles && c.roles.frequency);
        const upsizeMeasure = columns.find(c => c.roles && c.roles.upsize);
        const colorColumn = columns.find(c => c.roles && c.roles.color);

        if (!brandColumn || !packColumn || !categoryTypeColumn || !entryMeasure || !frequencyMeasure || !upsizeMeasure) {
            this.svg.append("text")
                .attr("x", this.width / 2)
                .attr("y", this.height / 2)
                .attr("text-anchor", "middle")
                .text("Asegúrese de arrastrar todos los campos requeridos: Brand, Pack, Category Type, Entry, Frequency, Upsize.");
            return;
        }

        const rawBrandData: BrandData[] = [];
        rows.forEach(row => {
            const brand: string = row[brandColumn.index] as string;
            const pack: string = row[packColumn.index] as string;
            const categoryType: string = row[categoryTypeColumn.index] as string; // NUEVO
            const entry: number = row[entryMeasure.index] as number;
            const frequency: number = row[frequencyMeasure.index] as number;
            const upsize: number = row[upsizeMeasure.index] as number;
            const color: string = colorColumn ? row[colorColumn.index] as string : "#ccc";

            rawBrandData.push({
                brand, pack, categoryType, entry, frequency, upsize, color
            });
        });

        // Agrupar los datos por Brand y Pack para calcular el yIndex
        const groupedByBrandPack = d3.group(rawBrandData, d => d.brand, d => d.pack);

        const margin = { top: 80, right: 20, bottom: 20, left: 150 }; // Aumentar top para títulos globales
        const barHeight = 15;
        const gap = 10;
        const colMetrics = ["Entry", "Frequency", "Upsize"]; // Nombres de las métricas

        // Columnas globales para SS mL y MS mL
        const globalCols = ["SS mL", "MS mL"];
        const totalGlobalWidth = this.width - margin.left - margin.right;
        const globalColWidth = totalGlobalWidth / globalCols.length;
        const metricColWidth = (globalColWidth / colMetrics.length) * 0.8; // Ancho para cada métrica dentro de SS/MS
        const xScale = d3.scaleLinear().domain([0, 100]).range([0, metricColWidth]);


        // Dibujar los títulos globales "SS mL" y "MS mL"
        globalCols.forEach((gCol, gIdx) => {
            const gColX = margin.left + gIdx * globalColWidth + globalColWidth / 2;
            this.svg.append("text")
                .attr("x", gColX)
                .attr("y", margin.top - 50) // Posición superior para títulos globales
                .text(gCol)
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .attr("fill", "black");

            // Dibujar los títulos de las métricas (Entry, Frequency, Upsize) debajo de cada globalCol
            colMetrics.forEach((mCol, mIdx) => {
                const mColX = margin.left + gIdx * globalColWidth + mIdx * (globalColWidth / colMetrics.length) + metricColWidth / 2;
                this.svg.append("text")
                    .attr("x", mColX)
                    .attr("y", margin.top - 25) // Posición para títulos de métricas
                    .text(mCol)
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("text-anchor", "middle")
                    .attr("fill", "black");
            });
        });


        let currentY = margin.top; // Altura de inicio para dibujar

        // Iterar sobre los grupos Brand y Pack
        groupedByBrandPack.forEach((packGroup, brand) => {
            packGroup.forEach((dataRowsForBrandPack, pack) => {
                // Etiqueta de Brand (solo una vez por Brand/Pack)
                this.svg.append("text")
                    .attr("x", 5)
                    .attr("y", currentY + barHeight / 1.5)
                    .text(`${brand} (${pack})`)
                    .attr("font-size", "10px")
                    .attr("fill", "black");

                // Dibujar las barras para SS mL y MS mL
                globalCols.forEach((gCol, gIdx) => {
                    const dataForCategory = dataRowsForBrandPack.find(d => d.categoryType === gCol);

                    if (dataForCategory) {
                        colMetrics.forEach((mCol, mIdx) => {
                            const dataKey = mCol.toLowerCase() as keyof BrandData;
                            const value = dataForCategory[dataKey] as number;

                            const barX = margin.left + gIdx * globalColWidth + mIdx * (globalColWidth / colMetrics.length);

                            this.svg.append("rect")
                                .attr("x", barX)
                                .attr("y", currentY)
                                .attr("width", xScale(value))
                                .attr("height", barHeight)
                                .attr("fill", dataForCategory.color);

                            this.svg.append("text")
                                .attr("x", barX + xScale(value) + 5)
                                .attr("y", currentY + barHeight / 1.5)
                                .text(`${value.toFixed(0)} %`)
                                .attr("fill", "black")
                                .attr("font-size", "10px")
                                .attr("text-anchor", "start");
                        });
                    }
                });
                currentY += (barHeight + gap); // Mover a la siguiente fila
            });
        });
    }
}