(function() {

  'use strict';

  function Nodedraggingfactory() {
    return function(modelservice, nodeDraggingScope, applyFunction) {

      var dragOffset = {};
      nodeDraggingScope.draggedNode = null;

      function getCoordinate(coordinate, max) {
        coordinate = Math.max(coordinate, 0);
        coordinate = Math.min(coordinate, max);
        return coordinate;
      }
      function getXCoordinate(x) {
        return getCoordinate(x, modelservice.getCanvasHtmlElement().offsetWidth);
      }
      function getYCoordinate(y) {
        return getCoordinate(y,  modelservice.getCanvasHtmlElement().offsetHeight);
      }
      return {
        dragstart: function(node) {
          return function(event) {
            modelservice.deselectAll();
            modelservice.nodes.select(node);
            nodeDraggingScope.draggedNode = node;

            var element = angular.element(event.target);
            dragOffset.x = parseInt(element.css('left')) - event.clientX;
            dragOffset.y = parseInt(element.css('top')) - event.clientY;

            event.dataTransfer.setData('Text', 'Just to support firefox');
            if (event.dataTransfer.setDragImage) {
              var invisibleDiv = angular.element('<div></div>')[0]; // This divs stays invisible, because it is not in the dom.
              event.dataTransfer.setDragImage(invisibleDiv, 0, 0);
            } else {
              event.target.style.display = 'none'; // Internetexplorer does not support setDragImage, but it takes an screenshot, from the draggedelement and uses it as dragimage.
              // Since angular redraws the element in the next dragover call, display: none never gets visible to the user.
            }
          };
        },

        drop: function(event) {
          if (nodeDraggingScope.draggedNode) {
            return applyFunction(function() {
              nodeDraggingScope.draggedNode.x = getXCoordinate(dragOffset.x + event.clientX);
              nodeDraggingScope.draggedNode.y = getYCoordinate(dragOffset.y + event.clientY);
              event.preventDefault();
              return false;
            })
          }
        },

        dragover: function(event) {
          if (nodeDraggingScope.draggedNode) {
            return applyFunction(function() {
              nodeDraggingScope.draggedNode.x = getXCoordinate(dragOffset.x + event.clientX);
              nodeDraggingScope.draggedNode.y =  getYCoordinate(dragOffset.y + event.clientY);
              event.preventDefault();
              return false;
            });
          }
        },

        dragend: function(event) {
          if (nodeDraggingScope.draggedNode) {
            nodeDraggingScope.draggedNode = null;
            dragOffset.x = 0;
            dragOffset.y = 0;
          }
        }
      };
    };
  }

  angular
    .module('flowchart')
    .factory('Nodedraggingfactory', Nodedraggingfactory);

}());
