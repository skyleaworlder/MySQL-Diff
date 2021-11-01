import { Difference } from "@/model/Difference";

/**
 * Appender<T>
 * 所有的 container class 都需要实现的 interface。
 * 目的是让 class 中的 Map 如列表般操作。
 */
export interface Appender<T> {
  append(elem: T): void;
}


/**
 * Comparer<Container, Elements>
 * 所有 data model 都要实现的接口。因为所有 model 都是可以比较的。
 * table / column / key / constraint 都需要支持。
 */
export interface Comparer<Container, Element> {
  compareTo(that: Container): Array<Difference<Element>>;
}


/**
 * Equaler<T>
 * 所有基本单元都要实现这个 interface 供 container class 调用。
 */
export interface Equaler<T> {
  equal(that: T): boolean;
}


/**
 * Transformer<T>
 * 最后 DDL 语句的输出。
 */
export interface Transformer<T> {
  transform(differences: Array<Difference<T>>): Array<String>;
}


/**
 * Serializer<T>
 * DDL 还原。
 */
export interface Serializer {
  serialize(): string;
}


export class TableContext {
  table_name: String;

  constructor(table_name: String) {
    this.table_name = table_name;
  }
}


export class TableElement  {
  class_name: String;

  constructor() {
    this.class_name = "TableElement";
  }

}
