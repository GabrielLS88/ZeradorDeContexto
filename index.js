async function fazerRequisicaoInicial(identity) {
  try {
    const response = await fetch(`https://telek.http.msging.net/commands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Key dGVsZWtyb3V0ZXI6alBxTDBocjNOc3kwZVdwYVFINVU="
      },
      body: JSON.stringify({
        id: '{{$guid}}',
        to: 'postmaster@builder.msging.net',
        method: 'get',
        uri: `/contexts/${identity}@wa.gw.msging.net`
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer a requisição inicial');
    }

    const jsonResponse = await response.json();
    console.log('API Response:', jsonResponse);
    return jsonResponse;
  } catch (error) {
    alert('Erro ao fazer a requisição inicial:', error);
    throw error;
  }
}

async function deletarVariaveis(identity, items) {
  try {
    const variaveisZeradas = [];
    for (const variable of items) {
      const response = await fetch(`https://telek.http.msging.net/commands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Key dGVsZWtyb3V0ZXI6alBxTDBocjNOc3kwZVdwYVFINVU="
        },
        body: JSON.stringify({
          id: '{{$guid}}',
          to: 'postmaster@builder.msging.net',
          method: 'delete',
          uri: `/contexts/${identity}@wa.gw.msging.net/${variable}`
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar a variável ${variable}`);
      }

      variaveisZeradas.push(variable);
    }
    alert(`Variáveis deletadas: ${variaveisZeradas.join(", ")}`);
  } catch (error) {
    alert('Erro ao deletar variáveis:', error);
    throw error;
  }
}

async function main() {
  try {
    const identity = document.getElementById("inputNumber").value;
    if (identity === '') {
      alert("O campo do número está vazio");
      return;
    }

    const response = await fazerRequisicaoInicial(identity);
    
    if (!response || !response.resource || !Array.isArray(response.resource.items)) {
      alert("Nenhuma variável para ser zerada!");
      console.error('Unexpected response structure:', response);
      return;
    }
    const variaveis = response.resource.items;
    if (variaveis.length === 0) {
      alert("Nenhuma variável para ser zerada!");
      return;
    }
    await deletarVariaveis(identity, variaveis);
  } catch (error) {
    console.error('Erro:', error);
  }
}

document.addEventListener('keydown', function(e){
  if(e.key == "Enter"){
    main()
  }
})