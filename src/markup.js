const core = require("@actions/core");

function getMarkupForJson(jsonResults, reportName) {
  return `
# ${reportName}
${getBadge(jsonResults.stats, "Tests")}
${getTestmessages(jsonResults.stats, jsonResults.message)}
  `;
}

function getBadge(stats, name) {
  const failedCount = stats.failed;
  const totalCount = stats.total;
  const passedCount = totalCount - failedCount;

  const badgeCountText =
    failedCount > 0
      ? `${failedCount}/${totalCount}`
      : `${passedCount}/${totalCount}`;
  const badgeStatusText = failedCount > 0 ? "FAILED" : "PASSED";
  const badgeColor = failedCount > 0 ? "red" : "brightgreen";

  return `![Generic badge](https://img.shields.io/badge/${name}_${badgeCountText}-${badgeStatusText}-${badgeColor}.svg)`;
}

function getTestmessages(stats, message) {
  const failedCount = stats.failed;
  const totalCount = stats.total;
  const passedCount = totalCount - failedCount;

  return `
<details>  
  <summary> Resumo </summary>
  <table>
    <tr>
      <th>Total:</th>
      <td><code>${totalCount}</code></td>
    </tr>
    <tr>
      <th>Passed:</th>
      <td><code>${passedCount}</code></td>    
    </tr>
    <tr>
      <th>Failed:</th>
      <td><code>${failedCount}</code></td>
    </tr>
    <tr>
      <th>Percent passed (%):</th>
      <td><code>${(passedCount / totalCount) * 100}</code></td>
    </tr>
    <tr>
      <th>Message:</th>
      <td><code>${message.message}</code></td>
    </tr>
  </table>
</details>
  `;
}

module.exports = {
  getMarkupForJson,
};
