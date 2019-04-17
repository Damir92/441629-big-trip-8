import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;

const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
timeSpendCtx.height = BAR_HEIGHT * 4;

let moneyChart = ``;
let transportChart = ``;
let timeSpendChart = ``;

const getParameters = (legend, value, index) => {
  return {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: legend,
      datasets: [{
        data: value,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => {
            return index === `€` ? index + ` ${val}` : `${val}` + index;
          }
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  };
};

export const createMoneyChart = (source) => {
  if (moneyChart) {
    moneyChart.destroy();
  }
  moneyCtx.height = BAR_HEIGHT * source.type.length;
  moneyChart = new Chart(moneyCtx, getParameters(source.legend, source.price, `€`));
  return moneyChart;
};

export const createTransportChart = (source) => {
  if (transportChart) {
    transportChart.destroy();
  }
  transportCtx.height = BAR_HEIGHT * source.type.length;
  transportChart = new Chart(transportCtx, getParameters(source.legend, source.count, `x`));
  return transportChart;
};

export const createTimeSpendChart = (source) => {
  if (timeSpendChart) {
    timeSpendChart.destroy();
  }
  timeSpendCtx.height = BAR_HEIGHT * source.type.length;
  timeSpendChart = new Chart(timeSpendCtx, getParameters(source.legend, source.time, `H`));
  return timeSpendChart;
};
