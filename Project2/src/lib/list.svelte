<script>
  let { search_results, results_per_page } = $props();
</script>

<table class="list-results">
  <thead>
    <tr>
      <th>Name</th>
      <th>Formal Name</th>
      <th>Spaces</th>
      <th>Features</th>
      <th>Layouts</th>
      <th>Capacity</th>
    </tr>
  </thead>
  <tbody>
    {#each search_results as result}
      <tr>
        <td><button onclick={() => result.favorite = !result.favorite}>{result.favorite ? '★' : '☆'}</button>{result.name}</td>
        <td style="font-weight: bold;">{result.formal_name}</td>
        <td>{result.spaces}</td>
        <td>{result.features}</td>
        <td>{result.layouts}</td>
        <td>{result.capacity}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .list-results {
    border-top: 2px; 
    border-bottom: 2px;
    border-color: black;
  }

  table {
    width: 100%;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-top: 2px solid #ddd;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

</style>
