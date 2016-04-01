import React, {Component} from 'react'
import ReactTestUtils, {renderIntoDocument, Simulate} from 'react-addons-test-utils'
import {findDOMNode} from 'react-dom'
import assert from 'assert'
import BigAdditionButton from '../app/bigAdditionButton';
import expect, { createSpy, spyOn, isSpy  } from 'expect';

describe('bigAdditionButton', () => {

  it('should render', () => {
    var renderer = ReactTestUtils.createRenderer()
    renderer.render(<BigAdditionButton className="foo"/>)
    var output = renderer.getRenderOutput()
    assert(output.type == "span")
    assert(output.props.className == "foo")
    var label = output.props.children
    assert(label.type == "b")
  });

  it('should be clickable', () => {
    var renderer = ReactTestUtils.createRenderer()
    var spy = createSpy()
    renderer.render(<BigAdditionButton onClick={ spy }  className="foo"/>)
    var output = renderer.getRenderOutput()
    output.props.onClick()
    expect(spy).toHaveBeenCalled()
  });
});
