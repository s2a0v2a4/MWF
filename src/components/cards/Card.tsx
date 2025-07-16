import React from 'react';
import './Card.css';

type CardProps = {
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="card">{children}</div>;
};

export default Card;
// type CardProps = {
//   children: ReactNode;
// };

// export default function Card({ children }: CardProps) {
//   return <div className="card">{children}</div>;
// }