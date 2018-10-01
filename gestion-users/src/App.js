import React, { Component } from 'react';
import ReactTable from "react-table";
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        data: [],
        title: '',
        body: '',
        id: ''
    };
  }

  componentDidMount(){
      this.getAllUsers();
  }

  closeModal() {
      document.getElementById('modalAction').style.display = 'none';
      this.setState({actionType: ""});
  }

  modalActions() {
        let displyHeader = "";
        let calledComponent = "";
        let modalWidth = "";
        switch (this.state.actionType) {
            case "new":
                modalWidth = "63%";
                displyHeader = "Nouveau Utilisateur";
                calledComponent = (
                    <div className="container-fluid">
                        <div className="col-md-10 offset-1">
                            <div className="form-group">
                                <label htmlFor="title">Nom</label>
                                <input type="text" className="form-control" name="title" id="title"
                                       onChange={(event)=>{this.setState({title:event.target.value})}}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="body">Prenom</label>
                                <input type="text" className="form-control" name="body" id="body"
                                       onChange={(event)=>{this.setState({body:event.target.value})}}
                                />
                            </div>
                            <button type="button" className="btn btn-primary"
                                    onClick={(event)=>{
                                      this.ajouterUser(event);
                                      this.closeModal();
                                    }}
                            >
                                Submit
                            </button>
                            <button className="btn btn-default ml-3" onClick={()=>{this.closeModal();}}>Annuler</button>
                        </div>
                    </div>
                );
                break;
            case "edit":
                modalWidth = "63%";
                displyHeader = "Modifier Utilisateur";
                calledComponent = (
                    <div className="container-fluid">
                        <div className="col-md-10 offset-1">
                            <div className="form-group">
                                <label htmlFor="title">Nom</label>
                                <input type="text" className="form-control" name="title" id="title"
                                       value={this.state.title}
                                       onChange={(event)=>{this.setState({title:event.target.value})}}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="body">Prenom</label>
                                <input type="text" className="form-control" name="body" id="body"
                                       value={this.state.body}
                                       onChange={(event)=>{this.setState({body:event.target.value})}}
                                />
                            </div>
                            <button type="button" className="btn btn-primary"
                                    onClick={(event)=>{
                                        this.modifierUser(event);
                                        this.closeModal();
                                    }}
                            >
                                Submit
                            </button>
                            <button className="btn btn-default ml-3" onClick={()=>{this.closeModal();}}>Annuler</button>
                        </div>
                    </div>
                );
                break;
            default:
                break;
        }
        return (
            <div className="w3-container">
                <div id="modalAction" className="w3-modal">
                    <div className="w3-modal-content w3-card-4 w3-animate-zoom" style={{maxWidth: modalWidth}}>
                        <header className="w3-container w3-blue">
                                <span
                                    onClick={() => {
                                        this.closeModal();
                                    }}
                                    className="w3-button w3-blue w3-display-topright">&times;</span>
                            <h6>{displyHeader}</h6>
                        </header>
                        <div className="w3-container" style={{paddingBottom: '10px'}}>
                            {calledComponent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

  getAllUsers(){
      const url="http://localhost:8000/posts";
      fetch(url,  {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
      }).then(response => response.json()
      ).then(users => {
          console.log('users',users);
          this.setState({data:users});
      }).catch(error =>{
          console.log(error);
          return error;
      });
  }

  deleteUser(id){
      const url="http://localhost:8000/posts/"+id;
      fetch(url,  {
          method: 'DELETE',
          headers: {
              'Accept': 'application/json'
          }
      }).then(response => {
          console.log('resp',response);
          let data = this.state.data;
          const index = data.findIndex((user)=>{
              return user.id === id;
          });
          data.splice(index,1);
          this.setState({data:data});
      }).catch(error =>{
          console.log(error);
          return error;
      });
  }

    ajouterUser(event){
      event.preventDefault();

      const user = {
          title:this.state.title,
          body: this.state.body
      };
      console.log('user',user);
      const url="http://localhost:8000/posts";
      fetch(url,  {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
      }).then(response => {
          console.log('resp',response);
          let data = this.state.data;
          data.push(user);
          this.setState({data:data});
      }).catch(error =>{
          console.log(error);
          return error;
      });
    }

    modifierUser(event){
        event.preventDefault();

        const user = {
            title:this.state.title,
            body: this.state.body
        };
        console.log('user',user);
        const url="http://localhost:8000/posts/"+this.state.id;
        fetch(url,  {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(response => {
            console.log('resp',response);
            let data = this.state.data;
            const index = data.findIndex((user)=>{
                return user.id === this.state.id;
            });
            data[index] = user;
            this.setState({data:data});
        }).catch(error =>{
            console.log(error);
            return error;
        });
    }


    render() {

      const columns = [
          {
              Header: 'Nom',
              accessor: 'title',
          },
          {
              Header: 'Prenom',
              accessor: 'body',
          },
          {
              Header: 'Action',
              filterable: false,
              sortable: false,
              resizable: false,
              style: {
                  textAlign: "center"
              },
              width: 180,
              maxWidth: 180,
              minWidth: 180,
              Cell: props => {
                  return (
                      <div>
                          <button className="btn btn-sm btn-success" style={{marginLeft: '3px'}}
                                  onClick={() => {
                                      this.setState({actionType: "edit"});
                                      this.setState({id: props.original.id});
                                      this.setState({title: props.original.title});
                                      this.setState({body: props.original.body});
                                      document.getElementById('modalAction').style.display = 'block';
                                  }}
                          >
                              Modifier
                          </button>
                          <button className="btn btn-sm btn-danger" style={{marginLeft: '3px'}}
                                  onClick={() => {
                                      this.deleteUser(props.original.id)
                                  }}
                          >
                              Supprimer
                          </button>
                      </div>
                  )
              }
          }
      ];

    return (
      <div className="container">
        <div style={{marginTop:'20px'}}>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modalAction"
                onClick={() => {
                    this.setState({actionType: "new"});
                    document.getElementById('modalAction').style.display = 'block';
                }}
            >
                Ajouter Utilisateur
            </button>
            {this.modalActions()}
            <ReactTable className="-striped -highlight" noDataText={"no data found"}
                        data={this.state.data} columns={columns} filterable={this.state.filterable}
                        defaultPageSize={10}
                        getTdProps={(state, rowInfo, column) => {
                            return {
                                style: {
                                    overflow: column.id === "body" || column.id === "title" ? 'inherit !important' : 'inherit'
                                }
                            }
                        }}
            >
            </ReactTable>
        </div>

      </div>
    );
  }
}

export default App;
