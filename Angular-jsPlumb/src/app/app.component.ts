import { Component } from '@angular/core';
import { jsPlumb } from 'jsplumb';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-jsPlumb';
  jsPlumbInstance;
  sourceEndpoint;
  targetEndpoint;
  connectorHoverStyle;
  endpointHoverStyle;
  init;
  ngAfterViewInit() {
    this.jsPlumbInstance = jsPlumb.getInstance({
      // default drag options
      DragOptions: { cursor: 'pointer', zIndex: 2000 },
      // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
      // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
      ConnectionOverlays: [
          [ "Arrow", {
              location: 1,
              visible:true,
              width:11,
              length:11,
              id:"ARROW",
              events:{
                  click:function() { alert("you clicked on the arrow overlay")}
              }
          } ],
          [ "Label", {
              location: 0.1,
              id: "label",
              cssClass: "aLabel",
              events:{
                  tap:function() { alert("hey"); }
              }
          }]
      ],
      Container: "canvas"
  });
  
  var basicType = {
    connector: "StateMachine",
    paintStyle: { stroke: "red", strokeWidth: 4 },
    hoverPaintStyle: { stroke: "blue" },
    overlays: [
        "Arrow"
    ]
}
this.jsPlumbInstance.registerConnectionType("basic", basicType);

var connectorPaintStyle = {
  strokeWidth: 2,
  stroke: "#61B7CF",
  joinstyle: "round",
  outlineStroke: "white",
  outlineWidth: 2
};

this.connectorHoverStyle = {
  strokeWidth: 3,
  stroke: "#216477",
  outlineWidth: 5,
  outlineStroke: "white"
},
this.endpointHoverStyle = {
  fill: "#216477",
  stroke: "#216477"
},
// the definition of source endpoints (the small blue ones)
this.sourceEndpoint = {
  endpoint: "Dot",
  paintStyle: {
      stroke: "#7AB02C",
      fill: "transparent",
      radius: 7,
      strokeWidth: 1
  },
  isSource: true,
  connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
  connectorStyle: connectorPaintStyle,
  hoverPaintStyle: this.endpointHoverStyle,
  connectorHoverStyle: this.connectorHoverStyle,
  dragOptions: {},
  overlays: [
      [ "Label", {
          location: [0.5, 1.5],
          label: "Drag",
          cssClass: "endpointSourceLabel",
          visible:false
      } ]
  ]
},
// the definition of target endpoints (will appear when the user drags a connection)
this.targetEndpoint = {
  endpoint: "Dot",
  paintStyle: { fill: "#7AB02C", radius: 7 },
  hoverPaintStyle: this.endpointHoverStyle,
  maxConnections: -1,
  dropOptions: { hoverClass: "hover", activeClass: "active" },
  isTarget: true,
  overlays: [
      [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
  ]
};
this.init = function (connection) {
  connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
};

this.jsPlumbInstance.batch(function () {

this.addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
  this.addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
  this.addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
  this.addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);

  // listen for new connections; initialise them the same way we initialise the connections at startup.
  this.jsPlumbInstance.bind("connection", function (connInfo, originalEvent) {
      this.init(connInfo.connection);
  });

  // make all the window divs draggable
  this.jsPlumbInstance.draggable(this.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
  // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
  // method, or document.querySelectorAll:
  //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

  // connect a few up
  this.jsPlumbInstance.connect({uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true});
  this.jsPlumbInstance.connect({uuids: ["Window2LeftMiddle", "Window4LeftMiddle"], editable: true});
  this.jsPlumbInstance.connect({uuids: ["Window4TopCenter", "Window4RightMiddle"], editable: true});
  this.jsPlumbInstance.connect({uuids: ["Window3RightMiddle", "Window2RightMiddle"], editable: true});
  this.jsPlumbInstance.connect({uuids: ["Window4BottomCenter", "Window1TopCenter"], editable: true});
  this.jsPlumbInstance.connect({uuids: ["Window3BottomCenter", "Window1BottomCenter"], editable: true});
  //

  //
  // listen for clicks on connections, and offer to delete connections on click.
  //
  this.jsPlumbInstance.bind("click", function (conn, originalEvent) {
     // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
       //   instance.detach(conn);
      conn.toggleType("basic");
  });

  this.jsPlumbInstance.bind("connectionDrag", function (connection) {
      console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
  });

  
})

  }

  addEndpoints(toId, sourceAnchors, targetAnchors) {
    for (var i = 0; i < sourceAnchors.length; i++) {
        var sourceUUID = toId + sourceAnchors[i];
        this.jsPlumbInstance.addEndpoint("flowchart" + toId, this.sourceEndpoint, {
            anchor: sourceAnchors[i], uuid: sourceUUID
        });
    }
    for (var j = 0; j < targetAnchors.length; j++) {
        var targetUUID = toId + targetAnchors[j];
        this.jsPlumbInstance.addEndpoint("flowchart" + toId, this.targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
    }
  
  }
}