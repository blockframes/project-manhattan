import type { firestore } from 'firebase';

export class Movie {
  id: string;
  title: string;
}

export const movieConverter: firestore.FirestoreDataConverter<Movie> = {
  fromFirestore: (snapshot) => ({ id: snapshot.id, ...snapshot.data() } as Movie),
  toFirestore: (movie: Movie) => movie,
}