import React,{Component} from 'react'
import {findDOMNode} from 'react-dom'
import {connect} from 'react-redux'
import './styles/card.css'

export default (props) => (
  <span
    className={ props.className || "add-card-btn"}
    onClick={props.onClick}>
    <b>+</b>
  </span> 
)
