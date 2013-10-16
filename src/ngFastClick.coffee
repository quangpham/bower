# https://github.com/joegaudet/ng-fast-click
app.directive "ngFastClick", ["$parse", "Modernizr", ($parse, Modernizr) ->
  "use strict"
  restrict: "A"
  link: (scope, element, attrs) ->
    fn = $parse(attrs.ngFastClick)
    startX = undefined
    startY = undefined
    canceled = undefined
    clickFunction = (event) ->
      unless canceled
        scope.$apply ->
          fn scope,
            $event: event

    if Modernizr.touch
      element.on "touchstart", (event) ->
        event.stopPropagation()
        touches = event.originalEvent.touches
        startX = touches[0].clientX
        startY = touches[0].clientY
        element.trigger "mousedown"
        canceled = false

      element.on "touchend", (event) ->
        event.stopPropagation()
        element.trigger "mouseup"
        clickFunction()

      element.on "touchmove", (event) ->
        touches = event.originalEvent.touches
        # handles the case where we've swiped on a button
        canceled = true  if Math.abs(touches[0].clientX - startX) > 10 or Math.abs(touches[0].clientY - startY) > 10

    unless Modernizr.touch
      element.on "click", (event) ->
        clickFunction event
]