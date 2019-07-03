import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { DataServiceError } from '../services/data-error.service';

// Function of additional success actions
// that returns a function that returns
// an observable of ngrx action(s) from DataService method observable
export const toAction = (...actions: Action[]) => <T>(
  source: Observable<T>,
  successAction: new (data: T) => Action,
  errorAction: new (err: DataServiceError<T>) => Action
) =>
  source.pipe(
    mergeMap((data: T) => [new successAction(data), ...actions]),
    catchError((err: DataServiceError<T>) => of(new errorAction(err)))
  );
