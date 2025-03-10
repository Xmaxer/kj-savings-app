<script lang="ts">
    import Chart from "chart.js/auto";
    import {onMount} from "svelte";
    import {savingsAccounts} from "./utils/savingsAccounts";
    import annotationPlugin from 'chartjs-plugin-annotation';

    let canvasElement: HTMLCanvasElement;

  onMount(() => {
      Chart.register(annotationPlugin)
      const amounts = new Array<number>(151).fill(0).map((_, i) => {
          return i * 1000
      });

      new Chart(canvasElement, {
          type: "line",
          data: {
              labels: amounts,
              datasets: [...savingsAccounts.map((account) => {
                  const data = amounts.map((amount) => {
                      return account.interestEarnedOnAmount(amount);
                  });
                  return {
                      label: account.name,
                      data: data,
                      borderColor: account.color,
                      fill: false,
                  }
              })]
          },
          options: {
              responsive: true,
              plugins: {
                  annotation: {
                      annotations: {
                        revolutMetalThresholdLine: {
                            type: "line",
                            xMin: 50,
                            xMax: 50,
                            borderWidth: 1,
                            borderColor: "#00ffff",
                        }
                    }
                  },
                  legend:{
                      position: 'bottom',
                  },
                  title: {
                      display: true,
                      text: "Stuff!"
                  }
              },
              scales: {
                  y: {
                    ticks: {
                        callback(value: number | string) {
                            const val = (typeof value === 'number' ? value : parseInt(value, 10))
                            return new Intl.NumberFormat('en-IE', {style: "currency", currency: "EUR"}).format(val)
                        }
                    }
                  },
                  x: {
                      ticks: {
                          autoSkip: true,
                          maxTicksLimit: 15,
                          callback(value: number | string) {
                              const val = (typeof value === 'number' ? value : parseInt(value, 10)) * 1000
                              return new Intl.NumberFormat('en-IE', {style: "currency", currency: "EUR"}).format(val)
                          }
                      }
                  }
              },
              elements: {
                  point: {
                      radius: 0,
                      backgroundColor: "#55555580",
                      hitRadius: 4,
                      hoverRadius: 10
                  }
              }
          },
      })
  })
</script>

<main>
<canvas id="graph" bind:this={canvasElement} style="width: 1000px; height: 500px"></canvas>
</main>

<style>

</style>
