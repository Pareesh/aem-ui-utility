(function(document) {

    var clicked;
    function getPreviousAndCurrentSiblings(element, selector='*') {
        var result = [];
        var tempElement = element;

        while (tempElement) {
            if(element.matches(selector)) {
                result.push(tempElement);
            }
            tempElement = tempElement.previousElementSibling;
        }

        return result;
    }

    function click(event) {
        var target = event.currentTarget;
        if(!target) {
            return;
        }

        var container = target.closest(".rating-component");
        var selectedItems = getPreviousAndCurrentSiblings(target, ".rating-component-item");
        var input = container.querySelector(".foundation-field-related");

        clearAllActive(container);

        container.querySelectorAll(".rating-component-item").forEach(function(item) {
            var isSelected = selectedItems.includes(item);
            item[isSelected ? "setAttribute" : "removeAttribute"]("selected", "");
        });

        var index = target.dataset.index ? parseInt(target.dataset.index, 10) + 1 : 0;
        input.value = index;

        clicked = true;
        requestAnimationFrame(function(){
            clicked = false;
        });
    }

    function mouseover(event) {
        var target = event.currentTarget;
        // sometime mouseover event gets executed just after clicking
        // clicked is added to avoid this run.
        if(!target || clicked) {
            clicked = false;
            return;
        }
        var container = target.closest(".rating-component");
        var activeItems = getPreviousAndCurrentSiblings(target, ".rating-component-item");

        container.querySelectorAll(".rating-component-item").forEach(function(item) {
            var isActive = activeItems.includes(item);
            item[isActive ? "setAttribute" : "removeAttribute"]("active", "");
        });
    }

    function clearAllActive(container) {
        container.querySelectorAll('.rating-component-item').forEach(item => {
            item.removeAttribute("active");
        });
    }

    function clearAllSelected(container) {
        container.querySelectorAll('.rating-component-item').forEach(item => {
            item.removeAttribute("selected");
        });
    }

    function mouseleave(event) {
        var container = event.currentTarget;
        clearAllActive(container);
    }

    $(document).on("foundation-contentloaded", function(event) {
        var target = event.target;
        target.querySelectorAll(".rating-component").forEach(container => {
            container.querySelectorAll(".rating-component-item").forEach(item => {
                item.addEventListener('mouseover', mouseover);
                item.addEventListener('click', click);
            });

            // add eventlistener on whole container b/c remove all active item
            // when mouse pointer is not within container
            container.addEventListener('mouseleave', mouseleave);
        });
    });

}(document))