import { Component, TemplateRef, OnInit } from '@angular/core';
import { Produto } from './model/produto';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Categoria } from './model/categoria';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public produtos: Produto[] = [];
  public selectedProduto: Produto = new Produto();
  public modalRef: BsModalRef;
  public title = 'Cadastrar Empregado';

  public categoria: Categoria = new Categoria();
  public categorias: Categoria[];

  private idToBeDeleted: number;

  constructor(private http: HttpClient,
              private modalService: BsModalService) {
  }

  public ngOnInit() {
    this.getAllCategorias();
    this.getAll();
  }

  public getAll() {
    this.http.get('http://virtserver.swaggerhub.com/Trabalhos/TrabalhoProgWeb3-2/1.0.0/Produto')
      .subscribe(res => {
        this.setProdutos(res);
    });
  }

  public getAllCategorias() {
    this.http.get('http://virtserver.swaggerhub.com/Trabalhos/TrabalhoProgWeb3-2/1.0.0/Categoria')
      .subscribe(res => {
        this.setCategorias(res);
    });
  }

  public onClickEditar(id: string) {
    this.selectedProduto = this.produtos.find(e => e.id === id);
    this.title = 'Editar Produto';
  }

  public onSubmit() {
    const produto: Produto = {
      nome: this.selectedProduto.nome,
      categoria: this.selectedProduto.categoria,
      preco: this.selectedProduto.preco
    };
    if (this.selectedProduto.id.length > 0) {
      this.updateProduto(produto, this.selectedProduto.id.toString());
    } else {
      this.saveProduto(produto);
    }
    this.title = 'Cadastrar Produto';
  }

  public deleteProduto(id: number) {
    this.http.delete('http://rest-api-employees.jmborges.site/api/v1/delete/' + id.toString())
    .subscribe(() => {
      this.getAll();
    });
  }

  public openModal(template: TemplateRef<any>, id: number) {
    this.idToBeDeleted = id;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  private setProdutos(array: any) {
    this.produtos = array;
  }

  private setCategorias(array: any) {
    this.categorias = array;
  }

  private saveProduto(produto: Produto) {
    this.http.post('http://rest-api-employees.jmborges.site/api/v1/create', produto)
    .subscribe(() => {
      this.selectedProduto = new Produto();
      this.getAll();
    });
  }

  private updateProduto(produto: Produto, id: string) {
    this.http.put('http://rest-api-employees.jmborges.site/api/v1/update/' + id, produto)
    .subscribe(() => {
      this.selectedProduto = new Produto();
      this.getAll();
    });
  }

  public confirm(): void {
    this.deleteProduto(this.idToBeDeleted);
    this.modalRef.hide();
  }

  public decline(): void {
    this.modalRef.hide();
  }

  public saveCategoria() {
    this.http.post('http://rest-api-employees.jmborges.site/api/v1/create', this.categoria.nome)
    .subscribe(() => {
      this.selectedProduto = new Produto();
      this.getAll();
    });
  }
}
