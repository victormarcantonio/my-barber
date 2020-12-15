$(document).ready(function (){
$.ajax({
	url: 'api/agendamento/somaValorMensal',
	success: function(result){
		
		console.log(result)
		
		var meses = {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
				6: 0,
				7: 0,
				8: 0,
				9: 0,
				10: 0,
				11: 0,
				12: 0
			} ; 
		
		function teste(int,valor){
			
			meses[int] = valor;
			return meses;
		};
		
		
		result.forEach(function(e){
			
			teste(e.mes,e.valor)
			
		});
		
		;
		
		var mesesGrafico = [];
		var valores = [];
		
		Object.entries(meses).forEach(function(e){
			mesesGrafico.push(converterMeses(e[0]));
			valores.push(e[1]);
		});
		
	
		
		
	/*
		result.forEach(function(e){
			
			meses.push(e.mes);
			valores.push(e.valor);
			
		});
		
		
		
		var value = [meses,valores];
		
		mesesInt.forEach(function(e){
			
			if(!meses.includes(e)){
				
				meses.push(e)
				valores.push(0)
			}
			
		});
		
		console.log(meses)
*/
		
		
		
		/*
		var meses = ['Janeiro','Março'];
		
		value[0].forEach(function(e){
			
			
			meses.forEach(function(e2){
				
				if(!e.includes(e2)){
					value[0].push(e2);
					value[1].push(0);
				}
			   
			});
			
		});*/
		
		new Chart(document.getElementById("bar-chart"), {
		    type: 'bar',
		    data: {
		      labels: mesesGrafico,
		      datasets: [
		        {
		          label: "Faturamento (reais)",
		          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
		          data: valores
		        }
		      ]
		    },
		    options: {
		      legend: { display: false },
		      title: {
		        display: true,
		        text: 'Em reais R$'
		      }
		    }
		});
		
	}
});  



});

function converterMeses(mesInt){
	
	meses = {
		1:'Jan',
		2:'Fev',
		3: 'Mar',
		4: 'Abr',
		5 : 'Mai',
		6: 'Jun',
		7: 'Jul',
		8: 'Ago',
		9: 'Set',
		10: 'Out',
		11: 'Nov',
		12: 'Dez'
	}
	
	return meses[mesInt];
};


