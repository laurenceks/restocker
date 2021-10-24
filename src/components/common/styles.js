const computedStyle = getComputedStyle(document.documentElement, null);
const bootstrapColourNames = ["--bs-blue", "--bs-indigo", "--bs-purple", "--bs-pink", "--bs-red", "--bs-orange", "--bs-yellow", "--bs-green", "--bs-teal", "--bs-cyan", "--bs-white", "--bs-gray", "--bs-gray-dark", "--bs-primary", "--bs-secondary", "--bs-success", "--bs-info", "--bs-warning", "--bs-danger", "--bs-light", "--bs-dark", "--bs-font-sans-serif", "--bs-font-monospace", "--bs-gradient"]
const bootstrapVariables = {};
bootstrapColourNames.forEach((x) => {
    bootstrapVariables[x.replace("--bs-", "")] = computedStyle.getPropertyValue(x);
});

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
            labels: {
                font: {
                    family: bootstrapVariables["font-sans-serif"],
                    color: bootstrapVariables.dark
                }
            }
        }
    },
    scales: {
        x: {
            ticks: {
                font: {
                    family: bootstrapVariables["font-sans-serif"],
                    color: bootstrapVariables.dark
                }
            }
        }, y: {
            ticks: {
                font: {
                    family: bootstrapVariables["font-sans-serif"],
                    color: bootstrapVariables.dark
                }
            }
        }
    }
}

console.log(bootstrapVariables["font-sans-serif"])

export {bootstrapVariables, commonChartOptions};