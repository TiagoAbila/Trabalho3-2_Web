import { Component, TemplateRef, OnInit } from '@angular/core';
import { Produto } from './model/produto';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public produtos: Produto[] = [];
  public selectedProduto: Produto = new Produto();
  public modalRef: BsModalRef;
  public title = 'Cadastrar Empregado';
  private idToBeDeleted: number;

  constructor(private http: HttpClient,
              private modalService: BsModalService) {
  }

  public ngOnInit() {
    this.getAll();
  }

  public getAll() {
    this.http.get('http://rest-api-employees.jmborges.site/api/v1/employees')
      .subscribe(res => {
        this.setProdutos(res);
    });

  }

  public onClickEditar(id: number) {
    this.selectedProduto = this.produtos.find(e => e.id === id);
    this.title = 'Editar Produto';
  }

  public onSubmit() {
    const produto: Produto = {
      nome: this.selectedProduto.nome,
      categoria: this.selectedProduto.categoria,
      preco: this.selectedProduto.preco
    };
    if (this.selectedProduto.id >= 0) {
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
    this.produtos = array.data;
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
}
