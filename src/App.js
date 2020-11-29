import React, {Component} from 'react';
import getResourse from "./services/sevices"
import './App.css';

export default class App extends Component {

  maxId = 100;

  state = {
    info: "",
    value: "",
    todoData : [
    ],
    data: "",
    loading: true,
    active: false
  }

  funcChange = (event) => {
    this.setState({
      value: event.target.value,
      info: event.target.value,
    })
    if(event.target.value != "") {
      let regexp = /^[a-z\d:,]+$/i;
      if(regexp.test(event.target.value)) {
        this.setState(({value}) => {
          return{
            value: event.target.value
          }
        })
      }
      else {
       this.setState(({value}) => {
         return{
           value: ""
         }
       })
      }
    }
  }

  dataFunc = () => {
    if(this.state.value == "") {
      alert("заполните поле 'тег'")
    }
    else {
      getResourse(`https://api.giphy.com/v1/gifs/random?api_key=gTJAO48YcpmrADUyo4opy4ES4g7iDBxx&tag=${this.state.info}`)
      .then(res => {
        let str = res.data.title;
        let text = this.state.info
        let reg = new RegExp(text, 'gi');
        let tags = str.match(reg).join();

        if(str.match(reg)) {
          this.setState(({data, loading}) => {
            return {
              data: res.data.images.downsized.url,
              loading: false,
            }
          })
  
          const newItem = {
            label: this.state.data,
            id: this.maxId++,
            tag: tags.toLowerCase()
          };
      
          this.setState(({ todoData }) => {
            const newArr = [
              ...todoData,
              newItem
            ];

            setTimeout(() => {
              this.setState({
                loading: true
              })
            }, 500)

            return {
              todoData: newArr
            }
          })
        }
        else {
          alert("По тегу ничего не найдено'")
        }
      })
      .catch(error => alert(`Произошла http ошибки' ${error.message}`));
    }
  }

  clearFunc = () => {
    this.setState(({todoData}) => {

      let arrLength = todoData.length;

      const newArray = [
        ...todoData.slice(arrLength)
      ];
      return {
        todoData: newArray,
        value: " ",
        info: " "
      }
    })
  }
  tagFunc = (e) => {
    this.setState(({info}) => {
      return {
        value: e.target.dataset.img
      }
    })
  }

  grupFunc = () => {
    this.setState(({active}) => {
      return {
        active: !active
      }
    })
  }

  render() {

    const {value, todoData, loading, active} = this.state;

    let arrGr = todoData.map((item) => 
         <div className="App__images" key={ item.id }>
          {item.tag == value ? <img src={ item.label } onClick={this.tagFunc} alt="text" data-img={item.tag} /> : null}
        </div>
    )
    let arr = todoData.map((el) => 
      <div className="App__images" key={ el.id }>
        <img src={ el.label } onClick={this.tagFunc} alt="text" data-img={el.tag}/>
      </div>
    );
    let dataIf = active ? arrGr : arr;

    return(
      <div className="App">
      <div className="App__box">
        <form>
          <input className="App__input" type="text"
             value={value} 
             onChange={this.funcChange} 
             placeholder="#тег" /> 
        </form>
    <button className="App__btn App__green" onClick={this.dataFunc} disabled={!loading ? "disabled" : null} >{loading ? "Загрузить" : "загрузка"}</button>
          <button className="App__btn App__red" onClick={this.clearFunc}>Очистить</button>
    <button className="App__btn App__blue" onClick={this.grupFunc}>{active ? "Разгрупировать" : "Групировать"}</button>
      </div>
      <div className="App__wrapper">
        <h3>{active ? value : null}</h3>
        <div className="App__inner">
          {dataIf}
        </div>
      </div>
      </div>
    )
  }
}