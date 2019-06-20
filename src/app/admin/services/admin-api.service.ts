import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  _done = new BehaviorSubject(false);
  _loading = new BehaviorSubject(false);
  _users = new BehaviorSubject([]);

  userCollectionSubsciption: Subscription;
  batchSize = 14;

  constructor(public angularFirestore: AngularFirestore) { }

  getFirstBatchOfUsers(): void {
    if (!this._done.value) {

      const firstBatch = this.angularFirestore.collection('users',
        ref => ref.orderBy('name').limit(this.batchSize));

      this.mapAndUpdate(firstBatch);

    }
  }

  getMoreUsers(lastVisibleDocument: any): void {

    const more = this.angularFirestore.collection('users', ref => {
      return ref
        .orderBy('name')
        .limit(this.batchSize)
        .startAfter(lastVisibleDocument);
    });
    this.mapAndUpdate(more);
  }

  mapAndUpdate(userCollection: AngularFirestoreCollection<any>): void {
    if (this._done.value) {
      return null;
    }

    this._loading.next(true);

    this.userCollectionSubsciption = userCollection
      .snapshotChanges()
      .pipe(
        tap(arr => {
          const values = arr.map(action => {
            const data = action.payload.doc.data();
            const doc = action.payload.doc;
            return { ...data, doc };
          });

          this._users.next(values);
          this._loading.next(false);

          if (!values.length) {
            this._done.next(true);
          }
        }))
      .subscribe();
  }

  reset() {
    console.log(' a resetear hpta');
    this._users.next([]);
    this._done.next(false);
    this._loading.next(true);
  }
}
