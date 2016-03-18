import {findDOMNode} from 'react-dom';

export default function previewMarkerCalc({containerName,
                                           itemContainerName,
                                           itemName,
                                           elementIdAttr,
                                           direction}) {

  var isVertical = direction == "vertical"
  var elementSide = isVertical ? "bottom" : "right"
  var elementCounterSide = isVertical ? "top" : "left"
  var topSides = isVertical ? ["top", "bottom"] : ["right", "left"]
  var mouseCoordinate = isVertical ? "y" : "x"

  function getDomElementDistanceFromMouse(mouse, itemElement, side) {
    let rect = itemElement.boundedRect
    return Math.abs(rect[side] - mouse)
  }

  function getDomitemElements(component) {
    let itemElement = findDOMNode(component)
    let itemsContainerEle = itemElement.getElementsByClassName(containerName)[0]
    let itemEles = itemsContainerEle.getElementsByClassName(itemContainerName)

    itemEles = Array.prototype.slice.call(itemEles)

    return itemEles.map(e => {
      let element = e.getElementsByClassName(itemName)[0]
      let boundedRect = element.getBoundingClientRect()

      return {
        itemId: e.getAttribute(elementIdAttr),
        element,
        boundedRect
      }})
  }

  function getTopElement(itemElements) {
    return _(itemElements).minBy(e => e.boundedRect[elementSide])
  }

  function getClosestElementToMouse(itemElements, mouse) {
    let closestElement = _(itemElements).minBy(e => getDomElementDistanceFromMouse(mouse, e, elementSide))
    return closestElement
  }

  return function getPreviewMarker(monitor, component) {
    let mouseOffset = monitor.getClientOffset()
    if (!mouseOffset) return;

    let mouse = mouseOffset[mouseCoordinate]
    let domitemElements = getDomitemElements(component)
    domitemElements = isVertical ? domitemElements :
                                   domitemElements.filter(e => e.boundedRect.top <= mouseOffset.y &&
                                                                mouseOffset.y <= e.boundedRect.bottom)

    let closestElement = getClosestElementToMouse(domitemElements, mouse)
    let previewitemId = closestElement ? closestElement.itemId : "-1"
    let previewMarkerLoc

    if (domitemElements && domitemElements.length > 0) {
      let topElement = getTopElement(domitemElements)

      if (closestElement == topElement) {
        let closestSide = _(topSides).minBy(side => getDomElementDistanceFromMouse(mouse, topElement, side))
        previewMarkerLoc = topElement.boundedRect[closestSide]
        previewitemId = closestSide == elementCounterSide ? -1 : previewitemId
      } else {
        previewMarkerLoc = closestElement.boundedRect[elementSide]
      }
    } else {
      previewMarkerLoc = mouse
    }

    return {
      previewMarkerLoc,
      previewitemId,
      closestElementRect: closestElement &&
                          closestElement.boundedRect
    }
  }
}
