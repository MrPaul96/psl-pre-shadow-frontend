import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { scan, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  _done = new BehaviorSubject(false);
  _loading = new BehaviorSubject(false);
  _users = new BehaviorSubject([]);

  users: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  userCollectionSubsciption: Subscription;
  batchSize = 13;
  prepend: false;

  isListActivated = false;

  constructor(public angularFirestore: AngularFirestore) { }

  getFirstBatchOfUsers() {
    const firstBatch = this.angularFirestore.collection('users',
      ref => ref.orderBy('name').limit(this.batchSize));

    this.mapAndUpdate(firstBatch);

    this.users = this._users.asObservable().pipe(
      scan((acc, val) => {
        return this.prepend ? val.concat(acc) : acc.concat(val);
      })
    );
  }

  getLastVisibleDocument() {
    const documentsArray = this._users.value;
    const documentsArraySize = documentsArray.length;

    if (documentsArraySize) {
      return documentsArray[documentsArraySize - 1].doc;
    }
  }

  getMoreUsers() {
    const lastVisibleDocument = this.getLastVisibleDocument();

    const more = this.angularFirestore.collection('users', ref => {
      return ref
        .orderBy('name')
        .limit(this.batchSize)
        .startAfter(lastVisibleDocument);
    });
    this.mapAndUpdate(more);
  }

  mapAndUpdate(userCollection: AngularFirestoreCollection<any>) {
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

          if (this.isListActivated) {

            this._users.next(values);
            this._loading.next(false);

            if (!values.length) {
              this._done.next(true);
            }
          }
        }))
      .subscribe();
  }

  reset() {
    this._users.next([]);
    this._done.next(false);
    this._loading.next(true);
  }
}
