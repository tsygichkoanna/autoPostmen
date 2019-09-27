import React from 'react';

export default function Title(props) {
  document.title = `Postmen - ${props.title}`;
  if(props.usrn){
    return <h1 className="section_title">{props.title +' '+ props.usrn}</h1>;
  }
  return <h1 className="section_title">{props.title}</h1>;
}
