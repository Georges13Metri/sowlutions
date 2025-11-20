import { Node } from './Node';

export class LinkedList<T> {
  head: Node<T> | null;
  size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Inserts a new node at the end of the list
  add(value: T): void {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  // Method to remove nodes greater than a given number
  removeGreaterThan(threshold: number): void {
    // Handle cases where the head itself is greater than the threshold
    while (this.head && (this.head.value as number) > threshold) {
      this.head = this.head.next;
      this.size--;
    }

    let current = this.head;
    let prev: Node<T> | null = null;

    while (current) {
      if ((current.value as number) > threshold) {
        if (prev) {
          prev.next = current.next;
        }
        this.size--;
      } else {
        prev = current;
      }
      current = current.next;
    }
  }

  toArray(): T[] {
    const arr: T[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }
}