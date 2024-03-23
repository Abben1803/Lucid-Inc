
export interface Book {
    id: number;
    title: string;
    paragraphs: Paragraph[];
    flagged: Flagged;
}
  
export interface Paragraph {
    id: number;
    paragraph: string;
    image?: Image;
}
  
export interface Image {
    id: number;
    image: string;
}
  
export interface Flagged {
    id: number;
    bookId: number;

}

export interface DashboardProps {
    additionalBooks: Book[];
}
  

export interface Bookmark {
    id: number;
    date: string;
    book: Book;
}

export interface AdminProps {
    newBooks: Book[];
}