function initialize() {
    let blockSize = document.getElementById('blockSize')
    let memSize = document.getElementById('memSize')
    let arqName = document.getElementById('idArqName')
    let arqSize = document.getElementById('idArqSize')
    let destiny = document.getElementById('idDestiny')
    let directory = document.getElementById('idDirectory')


    memSize.value = 128
    blockSize.value = 4
    arqName.value = 'teste.txt'
    arqSize.value = 4
    destiny.value = 'C:'
    directory.value = 'D:'
}

var blocoInicial = 32

var memoryList =  [
    {
        "block": blocoInicial,
        "fileName": 'C:',
        "nextBlock": 'nil',
        "state": 1, //1 - used,  2 - free
        "size":0,
        "type": 3, //tipo 3 diretorio, tipo 4 file
    }, 
]

function tableRefresh(memoryList) {

    var memSize = document.getElementById('memSize').value
    let table = document.getElementById('idFatTable')
    let cont=0
   
    memoryList.forEach(element => {
        cont++
    });

    for (let index=0, index2=0; index < memSize; index++, index2++){
        
        let row = document.createElement("tr")
        row.setAttribute("id","file"+index)
        row.onclick=clicar //adiciona dinamicamente a propriedade

        let block = document.createElement("td")
        let fileName = document.createElement("td")
        let nextBlock = document.createElement("td")
        let state = document.createElement("td")
       
        state.className = "free"
        block.innerHTML = parseInt(index) + 32
        state.innerHTML="Free"

        if (index2 < memoryList.length && memoryList[index2].state == 1 && memoryList[index2].type == 3) {
            const element = memoryList[index2]
            state.className = "used"
            state.innerHTML = "used"
            nextBlock.innerHTML = element.nextBlock
            fileName.innerHTML = element.fileName
            row.className="directory"
        }
        else if (index2 < memoryList.length && memoryList[index2].state == 1 && memoryList[index2].type == 4) {
            const element = memoryList[index2]
            state.className = "used"
            state.innerHTML = "used"
            nextBlock.innerHTML = element.nextBlock
            fileName.innerHTML = element.fileName
            row.className="file"
            row.style.backgroundColor='pink'
        }
        if (memoryList.length == 1) {
            row.appendChild(block)
            row.appendChild(fileName)
            row.appendChild(nextBlock)
            row.appendChild(state)
            table.appendChild(row)
        }  
       

    }
}


function createArq() {
    let arqName = document.getElementById('idArqName').value
    let arqSize = document.getElementById('idArqSize').value
    let destiny = document.getElementById('idDestiny').value
    let blockSize = document.getElementById('blockSize').value
    let iteracao = Math.ceil(arqSize/blockSize) 
    let validate = true

    for (let k = 0; k < memoryList.length; k++) {
        const element = memoryList[k];
        if (element.fileName == arqName) {
            validate = false
            break
        }
    }
    if(validate) {
    for (let index = 0; index < iteracao; index++) {
        blocoInicial++

        const element = {
            block: blocoInicial,
            fileName: arqName,
            nextBlock: blocoInicial+1,
            state: 1, //used
            size:arqSize,
            type: 4,
            destiny:destiny,  
        }
        let index2=index+1
        if (index2 >= iteracao) {
            const element = {
                block: blocoInicial,
                fileName: arqName,
                nextBlock:-1,
                state: 1, //used
                size:arqSize,
                type: 4, 
                destiny: destiny,
            }
            memoryList.push(element)
            break
        }
        memoryList.push(element)
        
    }
    upadateFat(memoryList)
    fillRaid(memoryList)
} else {
    alert('arquivo já existe')
}
}
let blockSize = document.getElementById('blockSize').value

function upadateFat(memoryList) {
    let table = document.getElementById('idFatTable')

    for (var i = 2, row; row = table.rows[i]; i++) {
        let verifica = i-2
        if (verifica > memoryList.length) {
            break
        }  
        
        if (i <= memoryList.length) {
            row.setAttribute("title","Nome: " + memoryList[verifica+1].fileName
            + "\n" + "Tamanho: " + memoryList[verifica+1].size + " KB" + "\n" +
            "Diretório: " + memoryList[verifica+1].destiny)
        }
        
        for (var j = 1, col; col = row.cells[j]; j++) {
          //iterate through columns
          let valor = col.innerHTML
          valor = parseInt(valor) 
          switch (j) {
            case 1:
                try {
                    col.innerHTML = memoryList[verifica+1].fileName
                    if (memoryList[verifica].type === 3) {
                        col.className='directory'
                    }
                  } catch (e) {
                  }
                break;
            case 2:
                try {
                    col.innerHTML = memoryList[verifica+1].nextBlock
                    if (memoryList[verifica].type === 3) {
                        col.className='directory'
                    }
                } catch (error) {
                    
                }
                

                break
            case 3:
                try {
                    if (parseInt(memoryList[verifica+1].state) == 1) {
                        col.innerHTML = 'Used'
                        col.className='used'
                    }
                    else {
                        col.innerHTML = 'Free'
                    }
                } catch (error) {
                    
                }

                break
            default:
                break;
          }
          try {
            if (memoryList[verifica].type === 3) {
                row.cells[0].className='directory'
              }
          } catch (error) {
            
          }
          
                            
        }  
    } 
} 

function directoryCreate() {
    let directory = document.getElementById('idDirectory').value
    let blockSize = document.getElementById('blockSize').value
    // ajuste
    const element = {
        block: blocoInicial,
        fileName: directory,
        nextBlock: 'nil',
        state: 1, //used
        size: blockSize,
        type: 3,
        destiny: "C:"  
    }
    memoryList.push(element)
    blocoInicial++

    upadateFat(memoryList)
}

function clicar() {
    this.className='deleted'
    this.cells[3].innerHTML='Free'
    this.cells[3].className='deleted'
    this.cells[1].innerHTML=''
    this.cells[2].innerHTML=''
    alert('deletou')
}
 
function listDir() {
    let directory = document.getElementById('idDirectory').value
    let output = []

    for (let index = 0; index < memoryList.length; index++) {
        const element = memoryList[index];
        if (element.destiny == directory) {
            output.push(element.fileName)
        }   
    }
    //let v = output.toString()
    
    output = output.filter((item,
        index) => output.indexOf(item) === index);
    alert("Lista de arquivos: " + output)
}

function fillRaid(lista) {
    let table = document.getElementById('idRaid3Table')
    debugger

    for (let index = 0; index < lista.length; index++) {
        let row = document.createElement('tr')
        row.style.color = 'white'
        row.onclick=encriptar //encripta no disco o arquivo como bitlocker 
        let r1 = Math.round(Math.random()*100)
        let r2 = Math.round(Math.random()*100)
        let r3 = Math.round(Math.random()*100)
        row.style.backgroundColor = 'rgb(' +r1 +','+r2+','+r3+')'
        const element = lista[index];
        let disk0 = document.createElement('td')
        disk0.innerHTML = element.fileName 
        let disk1 = document.createElement('td')
        disk1.innerHTML = element.fileName    
        let disk2 = document.createElement('td')
        disk2.innerHTML = element.fileName    
        let disk3 = document.createElement('td')
        r1 = Math.round((r1/100)*6) + 5
        disk3.innerHTML = (element.fileName + " - " + r1.toString(2))    
        
        row.appendChild(disk0)
        row.appendChild(disk1)
        row.appendChild(disk2)
        row.appendChild(disk3)
        table.appendChild(row)
    }

}
var tentativas = 0
var cripto_global = ""
var arquivosEncriptados = []
var listaSenhas = []
function geraSenha(senha) {
    //chave usada para codificar a mensagem
    let cripto = "01234567"

    let chaveInicial = [4,1,7,3,0,5,2,6]  
    for (let index = 0; index < senha.length; index++) {
        //cripto[chaveInicial[index]] = senha[index];  
        debugger
       cripto = cripto.replace(chaveInicial[index],senha[index])
    }
    return cripto
}

function encriptar() {

    if (this.cells[0].className !== 'encriptado') {
        arquivosEncriptados.push(this.cells[1].innerHTML)
        let senha = prompt("digite uma senha para encriptar:")
        chaveEncriptada = geraSenha(senha)
        listaSenhas.push(senha)
        this.cells[3].innerHTML=chaveEncriptada
        this.cells[1].innerHTML=chaveEncriptada
        this.cells[2].innerHTML=chaveEncriptada
        this.cells[0].innerHTML=chaveEncriptada
        this.cells[0].className='encriptado'
        cripto_global = chaveEncriptada
        alert('encriptado !!')
    } else {
        let senhainput = prompt("digite a senha para desbloquear:")
        let truesenha = listaSenhas.pop(senhainput)
        let arquivo = arquivosEncriptados.pop()
        debugger
        if(senhainput === truesenha){

            this.cells[3].innerHTML=arquivo
            this.cells[1].innerHTML=arquivo
            this.cells[2].innerHTML=arquivo
            this.cells[0].innerHTML=arquivo
            this.cells[0].className='desencriptado'
        } else {
            alert("senha incorreta")
        }
    }
}



initialize()
tableRefresh(memoryList)
