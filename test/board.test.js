import React, {Component} from 'react'
import ReactTestUtils, {renderIntoDocument, Simulate} from 'react-addons-test-utils'
import Board from '../app/board.jsx'
import TestBackend from 'react-dnd-test-backend'
import {DragDropContext} from 'react-dnd'
import store from '../app/store'
import {Provider} from 'react-redux'
import {findDOMNode} from 'react-dom'
import assert from 'assert'

function wrapInTestContext(DecoratedComponent) {
  return DragDropContext(TestBackend)(
      class TestContextContainer extends Component {
            render() {
                    return <DecoratedComponent {...this.props} />;
                  }
          }
    );
}

describe('board', () => {
  var component;

  before(() => {
    var BoardCtxt = wrapInTestContext(Board)
    component = renderIntoDocument(<Provider store={store}><BoardCtxt/></Provider>)
  })

  it('should render', () => {
    var listContainer = ReactTestUtils.findRenderedDOMComponentWithClass(component, "lists-container")
    var addListButton = ReactTestUtils.findRenderedDOMComponentWithClass(component, "add-list-btn")
    assert(!!listContainer)
    assert(!!addListButton)
    // console.log("DOM node:", listContainer)
  });
});
