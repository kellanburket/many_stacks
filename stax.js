$.fn.extend({
    disableSelection: function() {
        return this
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);
    },
    
    descendants: function(clz) {

		function recursiveSearch($node, descendants) {
			if ($node.hasClass(clz)) {
				if (descendants.length <= 0) {
					descendants = $node; 
				} else {
					descendants.add($node);
				}
			}
			
			$.each($node.children(), function() {
				descendants = recursiveSearch($(this), descendants);
			});

			return descendants;
		}

    	var descendants = $();
		descendants = recursiveSearch($(this), descendants);
		return descendants;
    },
    
    doublewidify: function(trigger, toggleOn, toggleOff) {
        $(this).on(trigger, do_doublewidify);
        var selector = $(this).selector;
        function do_doublewidify() {
            var stackWidth = $(this).width();
            $childwide = {};
            $fatherwide = {};
            $motherwide = {};
            $ipoint = {};
            
            if ($(".fatherwide").length > 0) {
            	$doublewide = $(".doublewide");
            	if($doublewide.hasClass('temp')) {
	                $children = $(".doublewide.temp").children();
					$children.unwrap();
				}
				
                $fatherwide = $('.fatherwide');
				
				$childwide = $('.childwide');
            	toggleOff.call(this, $childwide);

				$childwide.descendants('expandable').removeClass('inline-block');
				
				$childwide.appendTo($fatherwide);
				$('.fatherwide-bottom').children().unwrap().detach().appendTo($fatherwide);

				$motherwide = $('.motherwide');
				$('.motherwide-bottom').children().unwrap().detach().appendTo($motherwide);
                
                //$(this).disableSelection();
				//console.log("Big Family", $child, $father, $mother);
                //console.log('Data', $ipoint, $mother, $father,$ipoint.data());
				if ($doublewide.hasClass('temp')) {
	                $ipoint = $('.i-point');
					console.log('IPOINT', $ipoint);

	                if ($ipoint.data('style') == "prepend") {
		                    $ipoint.prepend($motherwide);
		                    $ipoint.prepend($fatherwide);
		            } else {
		                if ($ipoint.data('dir') == "next") {
		                    $motherwide.insertAfter($ipoint);
		                    $fatherwide.insertAfter($ipoint);
		                } else {
		                    $fatherwide.insertAfter($ipoint);
		                    $motherwide.insertAfter($ipoint);
		                }
		            }
					$ipoint.removeClass('i-point');
		        }
                
                $fatherwide.removeClass('fatherwide');
				$motherwide.children('.card-wrapper').first().css({height: "auto"});
				$motherwide.children('.card-wrapper').first().children('.card-content').css({top: 0});

                $motherwide.removeClass('motherwide');
                //$('.motherwide-bottom').removeClass('motherwide-bottom');
                //$('.fatherwide-bottom').removeClass('fatherwide-bottom');

				if ($doublewide.hasClass('temp')) {
		            $.each($children.not('.card-wrapper'), function() {
		                if ($(this).children().length == 0) {
		                    $(this).remove();
		                }
		            });
		        }

				if ($(this).hasClass('childwide')) {
					$(this).removeClass('childwide');
					return 0;
				}
				$childwide.removeClass('childwide');		            
			}


            $fatherwide = $(this).parent();
            var top = $(this).offset().top;
            var left = $(this).offset().left;
            var dir, style;

            
            if ($(this).parent().parent().hasClass('doublewide')) {
            	$doublewide = $(this).parent().parent();
            } else {
            	$doublewide = $('<div>', {class: 'doublewide temp', style: 'display: inline-block; vertical-align: top;'});

			}            
			
            $mother_stack = $('<div>', {class: 'stack motherwide-bottom'});
            $father_stack = $('<div>', {class: 'stack fatherwide-bottom'});

			if ($fatherwide.next('.stack').length > 0 && !$fatherwide.next().hasClass('doublewide')) {
			    dir = "next";
                $motherwide = $fatherwide.next('.stack');
                $mother_stack.addClass('stack-right');
                $father_stack.addClass('stack-left');
				$(this).addClass('float-left');
				$stack_left = $father_stack;
				$stack_right = $mother_stack;

                if ($fatherwide.prev().length > 0) {
                    $ipoint = $fatherwide.prev();
                    style = "append"
                } else {
                    $ipoint = $fatherwide.parent();
                    style = "prepend"
                }
                
            } else if ($fatherwide.prev('.stack').length > 0 && !$fatherwide.prev().hasClass('doublewide')) {
				//console.log("Has PREV", $fatherwide.prev('.stack'));
				$(this).addClass('float-right');

                dir = "prev";
                $motherwide = $fatherwide.prev('.stack');
                $mother_stack.addClass('stack-left');
                $father_stack.addClass('stack-right');
        
				$stack_left = $mother_stack;
				$stack_right = $father_stack;
                if ($motherwide.prev().length > 0) {
                    $ipoint = $motherwide.prev();
                    style = "append";
        
                } else {
                    $ipoint = $motherwide.parent();
                    style = "append";
                }
        
            } else {
				console.log("Has Nothing");
                return 0;
            }

			
            $fatherwide.addClass('fatherwide');
            $motherwide.addClass('motherwide');
            
            
            $(this).focus();
            $(this).addClass('childwide');
            $childwide = $(this);
            toggleOn.call(this, $childwide);
        
            $(this).nextAll().slice(0).appendTo($father_stack);
			$last = {};
			
			var mOffset = $motherwide.offset().top;
			
			$.each($motherwide.children(), function() {
				var height = $(this).height();
				var topOffset = $(this).offset().top;
                var difference = topOffset + height;
				console.log("Motherwide", "ChildHeight(" + height + ")", "ChildOffset(" + topOffset + ")", "ChildCardDiff(" + difference + ")", "CardTop(" + top + ")");

                if (topOffset > top) {
                	//-height + (difference - top)
                	
                	$(this).nextAll().andSelf().slice(0).appendTo($mother_stack);
					var magic_number = (top - topOffset + parseFloat($last.css('margin-bottom'))/2); 
					$first = $motherwide.children('.card-wrapper').first();							
					$first.css({height: $first.height() + magic_number});	
					$first.children('.card-content').css({top: magic_number});					

					return false;
                } else if (topOffset == top) {
                	$(this).nextAll().andSelf().slice(0).appendTo($mother_stack);
					return false;                
                }                
				$last = $(this);
            })
      
			if ($doublewide.hasClass('temp')) {
	            if (dir == "next") {
	                $fatherwide.detach().appendTo($doublewide);
	                $motherwide.detach().appendTo($doublewide);
	            } else {
	                $motherwide.detach().appendTo($doublewide);
	                $fatherwide.detach().appendTo($doublewide);
	            }
	        }

            $(this).detach().appendTo($doublewide);
            $(this).css({height: "auto"});
            //$(this).width(stackWidth * 2);
            
            
            $doublewide.append($stack_left, $stack_right);    
			
            //console.log($(this), stackWidth);
			if ($doublewide.hasClass('temp')) {
	            if (style == "prepend") {
	                $doublewide.prependTo($ipoint);
	            } else {
	                $doublewide.insertAfter($ipoint);
	            }
				$doublewide.width(stackWidth * 2);
	            $ipoint.addClass('i-point');
	            $ipoint.data({dir: dir, style: style});
	        }
        
        }
    }
});

(function() {
	Marionette.Listener = Marionette.Module.extend({
		wait: function(delay, callback) {
			var timer;
			return function() {
				var self = this;
				var args = arguments;
				
				clearTimeout(timer);
				timer = setTimeout(function() {
					callback.apply(self, args);
				}, delay);
			};	
		},
	});
	
	var ScrollListener = Marionette.Listener.extend({
		initialize: function(module, app, options) {
			this.globalChannel = Backbone.Wreqr.radio.channel('global');	
		},
	
		doScrollEvent: function() {		
			//console.log('ScrollListener:doScrollEvent', this.rootBottom);
			this.globalChannel.vent.trigger('userScrollEvent', this.rootBottom);
		},
		
		onStart: function(options) {		
			//console.log("ScrollListener Started");
			this.$root = $('.stax-container');
			this.rootTop = this.$root.scrollTop();
			this.rootBottom = this.rootTop + this.$root.height();
			
			this.globalChannel.vent.on('queueEmptied', this.stop);

			this.$root.mCustomScrollbar({
				scrollInertia: 1000,
				autoHideScrollbar: false, 
				snapAmount: null,
				contentTouchScroll: false,
				alwaysShowScrollbar: 2, 
				callbacks: {
					whileScrolling: this.wait(10, $.proxy(this.doScrollEvent, this))
				},
				keyboard: {
					scrollAmount: 15					
				},
				mouseWheel: {
					scrollAmount: 15
				},
				scrollButtons: {
					scrollAmount: 15
				},
				advanced: {
				
				}
			});
			//this.$root.scroll($.proxy(this.hasScrolledIntoView, this));
			//this.$root.bind('scroll', {}, this.throttle(0, $.proxy(this.hasScrolledIntoView, this)));
		},
		
		onStop: function(options) {
			console.log("ScrollListener Stopped");
		}
	});
	
	var ResizeListener = Marionette.Listener.extend({
		initialize: function(options) {
			this.model = options.model;
		},
		
		handleResize: function() {
			var iWidth = parseInt(window.innerWidth);
			//console.log('handleResize', iWidth);
			Stax.vent.trigger('browserResize', iWidth);
		},
	
		onStart: function() {
			this.hasStarted = true;	
			//console.log("Popping " + card.model.name);
			$(window).resize(this.wait(50, $.proxy(this.handleResize, this)));
			//this.$root.bind('scroll', {}, this.throttle(0, $.proxy(this.hasScrolledIntoView, this)));
		},
	
		onStop: function() {
			this.hasStarted = false;
			$(window).unbind('resize');		
		}
	});
	
	var ReversePriorityQueue = Marionette.Module.extend({
		
		initialize: function(options) {
			this.cards = [{priority: 0, card: {}}];
			this.topCard = {};
			this.globalChannel = Backbone.Wreqr.radio.channel('global');
			this.globalChannel.vent.on('userScrollEvent', this.handleUserScrollEvent, this); 
			this.globalChannel.vent.on('cardQueued', this.handleUserQueueEvent, this);
			this.globalChannel.vent.on('stackDestroyed', this.recalculatePriorities, this);
			this.globalChannel.vent.on('cardOpened', this.recalculatePriorities, this);
		},
		
		handleUserQueueEvent: function(card, method, height) {
			this[method](height, card);
		},
	
		handleUserScrollEvent: function(rootBottom) {
			if (!this.topCard['card']) {
				console.log('No Top Card', this.cards);
				this.popMax();
			}

			if (this.topCard['card']) {
					
				var top = this.topCard.card.$el.offset().top;
				var bottom = top + this.topCard.card.$el.height();
				if ((top <= rootBottom)) {
					console.log('Popping ' + this.topCard.card.model.get('name') + "(" + this.topCard.priority + ")");
					this.topCard.card.reveal();
					this.popMax();
				}
			} else {
				console.log('Queue has been emptied!', this.topCard);

				this.globalChannel.vent.trigger('queueEmptied');		
			}
		},
		
		empty: function() {
			if (!this.cards[1]) {
				return true;
			} else {
				return false;
			}
		},
		
		push: function(priority, card) {
			
			console.log("Pushing " + card.model.get('name') + "(" + priority + ")");
			
			var new_card = {priority: priority, card: card};
			this.cards.push(new_card);
			
			var hasOrder = false;
			do {
				hasOrder = this.orderUp(new_card);
			} while(!hasOrder);
		},
		
		orderUp: function(card) {
			var parent = this.getParent(card);
			if (card.priority < parent.priority) {
				this.swap(card, parent); 		
				return false;
			} else {
				return true;
			}	
		},
		
		printAll: function() {
			for(var i = 1; i < this.cards.length; i++) {
				console.log(this.cards[i].card.model.get('name'), this.cards[i].priority);
			}
		},
		
		orderDown: function(card) {
			var left = this.getLeftChild(card);
			var right = this.getRightChild(card);	
			
			if (right && left && left.priority < right.priority && left.priority < card.priority) {
				this.swap(card, left);
				return false;
			} else if(right && left && left.priority > right.priority && right.priority < card.priority) {
				this.swap(card, right);		
				return false;
			} else if (left && left.priority < card.priority) {
				this.swap(card, left);
				return false;
			} else if(right && right.priority < card.priority) {
				this.swap(card, right);	
				return false;			
			} else {
				//console.log("Ordering " + card.card.model.get('name') + "(" + card.priority + ")");
				return true;		
			}
		},
		
		popMax: function() {

			var returnValue = this.getRoot();
			if (returnValue) {
				this.globalChannel.vent.trigger('queuePopped');
				var lastValue = this.cards.pop();
				
				if (returnValue != lastValue) {
					this.cards[1] = lastValue;
					var hasOrder = false;
					do {
						hasOrder = this.orderDown(lastValue);
					} while(!hasOrder);	
				}
				
				this.topCard = returnValue;
			} else {
				this.globalChannel.vent.trigger('queueEmptied');			
			}
		},
		
		recalculatePriorities: function() {
			//this.printAll();			
			if (this.topCard.card) {
				console.log('topCard', this.topCard);
				var os = parseInt(this.topCard.card.$el.offset().top);
				var h = parseInt(this.topCard.card.$el.height());
				var priority = os - h;
				this.cards.push(priority, this.topCard);
			}
						
			for (var i = 1; i < this.cards.length - 1; i++) {
				if (this.cards[i].hasOwnProperty('card')) {
					console.log("Recalculate Priorities", this.cards[i]);
					this.cards[i].priority = this.cards[i].card.$el.offset().top - this.cards[i].card.$el.height();
				}
			} 

			return this.popMax();
		},
		
		find: function(card) {
			//console.log("Find", this.cards, card);
			for (var i = 1; i < this.cards.length; i++) {
				//console.log("Searching", this.cards[i].card.model.name, card.model.name);
				if (this.cards[i].card == card) {
					return this.cards[i];
				}
			} 
		},
		
		findIndex: function(card) {
			//console.log("Find", this.cards, card);
			for (var i = 1; i < this.cards.length; i++) {
				//console.log("Searching", this.cards[i].card.model.name, card.model.name);
				if (this.cards[i].card == card) {
					return i;
				}
			} 
		},
		
		sink: function(priority, card) {	
			//console.log("Sinking " + card.model.get('name') + "(" + priority + ")");
			var ncard = this.find(card);
			var hasOrder = false;
			if (!ncard) {
				this.push(priority, card);
			} else {
				ncard.priority = priority;
				do {
					hasOrder = this.orderDown(ncard);
				} while(!hasOrder);	
			}
		},
	
		swim: function(priority, card) {	
			//console.log("Swimming " + card.model.get('name') + "(" + priority + ")");
			var ncard = this.find(card);
			var hasOrder = false;
			if (!ncard) {
				this.push(priority, card);
			} else {
				ncard.priority = priority;
				do {
					hasOrder = this.orderUp(ncard);
				} while(!hasOrder);	
			}
		},
		
		swap: function(first, second) {
			//console.log("Swapping " + first.card.model.get('name') + "(" + first.priority + ") with " + second.card.model.get('name') + "(" + second.priority + ")");
			var kFirst = _.indexOf(this.cards, first);
			var kSecond = _.indexOf(this.cards, second);
			this.cards[kFirst] = second;
			this.cards[kSecond] = first;				
		},
		
		getRoot: function() {
			return this.cards[1];
		},
	
		getLeftChildByIndex: function(k) {
			return this.cards[k * 2];
		},
	
		getLeftChild: function(card) {
			var k = _.indexOf(this.cards, card);
			return this.getLeftChildByIndex(k);
		},
	
		getRightChildByIndex: function(k) {
			return this.cards[(k * 2) + 1];		
		},
	
		getRightChild: function(card) {
			var k = _.indexOf(this.cards, card);
			return this.getRightChildByIndex(k);
		},
	
		getParent: function(card) {
			var k = _.indexOf(this.cards, card);
			return this.cards[parseInt(k/2)];
		},
	});
	
	var Stax = new Backbone.Marionette.Application();
	var ScrollListener = Stax.module("ScrollListener", ScrollListener);
	var ReversePriorityQueue = Stax.module("ReversePriorityQueue", ReversePriorityQueue);
	var ResizeListener = Stax.module("ResizeListener", ResizeListener);
	
	Stax.addRegions({
		container: '.stax-container'
	});
	
	Stax.addInitializer(function(data){
		var stacksBuilder = new StacksController(data);			
	});
	
	$.getJSON(ajax.theme_url + '/cache/all-pets-pn.json', function(data) {
		
		$(document).ready(function() {
			//console.log('ScrollRoot', 'Document Ready');
			Stax.start(data);
		});	
	
	});

	var CardModel = Backbone.Model.extend({
		defaults: {
			featured_image: {},
		},
		
		initialize: function(attrs, opts) {
			this.setFeaturedImage(attrs.featured_image);
		},
		
		setFeaturedImage: function(featured_image) {
			this.attributes.featured_image = new Image();
			this.attributes.featured_image.src = featured_image;

			this.attributes.featured_image.onload = $.proxy(function() {
				Stax.vent.trigger('imagePreloaded', this);	
			}, this);
		}
	});
	
	
	var Card = Backbone.Marionette.ItemView.extend({ 
		
		className: 'card-wrapper',
		tagName: 'div',
		template: '#card-template',
		
		initialize: function(options) {
			//console.log(this.model.get('name') + " Initialized");
			this.isHidden = true;
			this.isExpanded = false;
			this.height = 0;
			this.top = 0;
			this.render();
		},
				
		hide: function() {
			this.$el.css('visibility', 'hidden');
			this.isHidden = true;
		},
	
		onRender: function() {
			Stax.vent.trigger('cardRendered', this, 'push');
			$('.tooltip-icon').hover(function(){
				$('.tooltip').css({visibility: 'hidden'});
				$(this).siblings('.tooltip').css({visibility: 'visible'});
			}, function() {
				$(this).siblings('.tooltip').css({visibility: 'none'});				

			});

			var toggleOn = $.proxy(function(thing) {
				var expandables = thing.descendants('expandable');
				expandables.show();
				expandables.css({visibility: "visible"});

				//this.$el.css({marginTop: -30});
			}, this);
			
			var toggleOff = $.proxy(function(thing) {
				var expandables = thing.descendants('expandable');
				expandables.hide();
				expandables.css({visibility: "hidden"});
				//this.$el.descendants('expandable').removeClass('inline-block');
				//this.$el.descendants('expandable').css({visibility: 'none'});
				//this.$el.css({marginTop: 0});
			}, this);

			this.$el.doublewidify('click', toggleOn, toggleOff);
			this.$el.click(function() {
				Stax.vent.trigger('cardOpened', this);
			});
		},
	
		getHeight: function() {
			if (!this.height) {
				
				var box_model = this.$el.css('box-sizing');
				if (box_model == 'border-box') {
					var height = parseInt(this.$el.height());
					var marginTop = parseInt(this.$el.css("margin-top"));
					var marginBottom = parseInt(this.$el.css("margin-bottom"));
					//console.log(this.model.name, box_model, height + "/" + this.$el.height(), marginTop + "/" + this.$el.css("margin-top"), marginBottom + "/" + this.$el.css("margin-bottom"));
					return height + marginBottom; //marginTop
				} else {
					return parseInt(this.$el.height());				
				}
			} else {
				return this.height;
			}
		},
	
		reveal: function() {
			if (this.isHidden) {
				this.isHidden = false;
				console.log("Revealing " + this.model.get('name'));
				//this.container.$el.css('height', 'auto');
				//var height = this.container.$el.height();
				//this.container.$el.css('height', height);
	
				this.slideUp(400, "swing").done($.proxy(function() {
				}, this));
			}
		},
		
		slideUp: function(duration, easing) {
			if (!easing) easing = "swing";
			if (!duration) duration = 400;
			var heightTop = $(window).height() - this.$el.height();
			//console.log(heightTop, easing, duration);
			//this.$el.show();
			this.$el.css({visibility: 'visible', height: this.$el.height()});
			this.$el.children().eq(0).css({marginTop: heightTop});
			return this.$el.children().eq(0).animate({marginTop: 0}, {duration: duration, easing: easing}).promise();
		},	
	
	});

	var CardCollection = Backbone.Collection.extend({
		model: Card,
		initialize: function(models, options) {
			//console.log('Card Collection', models, options);
		}
	});
	
	var Stack = Backbone.Marionette.CompositeView.extend({
		className: 'stack',
		tagName: 'div',
		childView: Card,
		template: _.template('<div class="stack"></div>'),
		
		
		initialize: function(children, options) {
			
			//console.log('Stack Initialized', options);
			this.parent = options.parent;
			this.$el.width(this.parent.stackWidth - 2);			
			this.offset = this.parent.offset;
			this.threshold = this.parent.threshold;
			this.collection = new CardCollection();
			this.hasCrossedThreshold = false;
			this.children = {};
			this.childrenById = {};

			if (children) {
				for (var i in children) {
					this.$el.attach(children[i].$el);
					this.addChild(children[i], this.$el.offset().top);
				}
			}

		},
		
		render: function($container) {
			console.log('Rendering New Stack', $container, this.$el);
			$container.append(this.$el);
		},
				
		getHeight: function() {
			var os = this.offset;
			var h = this.$el.height();
		
			var totalHeight =  os + h;
			if (!this.hasCrossedThreshold) {
				var iHeight = parseInt(window.innerHeight);		
				
				if (totalHeight > iHeight - this.threshold) {
					//console.log("height has crossed threshold", totalHeight, iHeight, this.model.getThreshold());
					this.hasCrossedThreshold = true;
				} else {
					//console.log("Has not crossed threshold", totalHeight, iHeight, this.model.getThreshold());	
				}
			} 
			return totalHeight;
		},
				
		popCard: function(index) {
			var mod = this.collection.pop();
			//console.log('PopCard', this.children);
			var card = this.childrenById[mod.id];
			//console.log('popCard', card);
			//card.attributes.$el.detach();
			//card.attributes.$el.unbind('click');
			return card;
		},
		
		onAdd: function(card) {
			//card.$el.click($.proxy(card.handleClick, card));
		},
	
		addChild: function(card, height) {
			this.children[height] = card;
			this.childrenById[card.model.id] = card;
		},
		
		pushCard: function(card, method) {
			var height = this.getHeight();
			
			this.$el.append(card.$el);	
			
			this.collection.add(card.model, card.model.get('id'));		
			this.addChild(card, height);
			
			Stax.vent.on('expanded:' + card.model.get('id'), this.expandCard, this);
			Stax.vent.on('shrunk:' + card.model.get('id'), this.shrinkCard, this);


			

			if (!this.hasCrossedThreshold) {
				card.reveal();
			} else {
				Stax.vent.trigger('cardQueued', card, method, height);
			}
		},

		
	});
	
	var Stacks = Backbone.Marionette.CompositeView.extend({
		template: '#stax-template', 
		el: '.mCSB_container',

		initialize: function(attrs, opts) {
			console.log('Stacks');
			this.stackWidth = attrs.stackWidth;

			this.$doublewide = {};
			this.children = [];
			this.threshold = 100;
			this.offset = $(this.el).offset().top;
			Stax.vent.on("browserResize", this.evaluateStacks, this);
			Stax.vent.on("stackExpanded", this.expandStack, this);
			Stax.vent.on("stackShrunk", this.shrinkStack, this);
						
			this.render();

			this.recalculateDimensions();		
			for (var i = 0; i < this.numStacks; i++) {
				this.pushStack();
			}
						
		},

		getSiblings: function(stack) {
			var siblings = {left: null, right: null};
			var stackFound = false;
			var last = {};
			_.each(this.children, function(el, i, li) {
				if (stackFound) {
					siblings.left = el;
					stackFound = false;
					return 0; 
				} else if (el == stack) {
					stackfound = true;
					siblings.right = last;
				}
				last = el;				
			}, this);		
			return siblings;
		},
		
		render: function() {
			this.$el.html(_.template($(this.template).html())());
			$('.mCSB_container').append(this.$el);
			
			var stacks = this;
			$.each(this.$el.children(), function() {
				//console.log('Each', $(this), this);
				if ($(this).hasClass('doublewide')) {
					stacks.$doublewide = $(this);
					stacks.$doublewide.width(stacks.stackWidth * 2);
				}
			})

			var offset_r = parseInt($('.pf-col').css('margin-right'));
			var offset_l = parseInt($('.pf-col').css('margin-left'));
			var offset = offset_r + offset_l + 4;
			//console.log('offset', offset_r, offset_l, offset);
			
			$('.two-cols').width(this.stackWidth * 2 - offset);
			$('.three-cols').width(this.stackWidth * 3 - offset);
			$('.one-col').width(this.stackWidth - offset);
			//$('.pf-col');
		},

		pushStack: function() {
			this.recalculateDimensions();
			var new_stack = new Stack({}, {parent: this});

			if (this.$doublewide.length > 0 && this.$doublewide.children('.stack').length < 2) {
				console.log("Render Doublewide");
				new_stack.render(this.$doublewide);
			} else {
				console.log("Render Regular");
				new_stack.render(this.$el);
			}

			this.children.push(new_stack);		
			return new_stack;
		},

		evaluateStacks: function(width) {
			this.recalculateDimensions();
			//console.log("Width(" + width + "), Threshold(" + lowThreshold + "--" + highThreshold + ")");		
			if (this.numStacks > this.children.length) {
				Stax.vent.trigger("highThresholdCrossed", this);
			} else if(this.numStacks < this.children.length) {
				Stax.vent.trigger("lowThresholdCrossed", this);
			}
		},

		recalculateDimensions: function() {
			this.width = this.$el.parent().width();		
			//console.log(this.width);
			this.numStacks = parseInt(this.width/this.stackWidth);
			this.lowThreshold = this.numStacks * this.stackWidth;
			this.highThreshold = this.lowThreshold + this.stackWidth;		
			//var mright = parseInt($(this.el).css('margin-right'));
			//var mleft = parseInt($(this.el).css('margin-left'));
			this.$el.width(this.lowThreshold + 4);		
		},

		
		getShortestStack: function() {
			var shortest = this.children[0];
			var shortest_index = 0;
			var shortest_height = shortest.getHeight();
			for(var j = 1; j < this.children.length; j++) {
				//console.log("Stack " + shortest_index + ": " + shortest_height + ", ", "Stack " + j + ": " + this.models[j].getHeight());
				var stack_height = this.children[j].getHeight();
				if (stack_height < shortest_height) {
					shortest = this.children[j];
					shortest_index = j;
					shortest_height = stack_height;
				}  		
			} 
			return shortest;		
		},
		
		getLongestStack: function() {
			var longest = this.children[0];
			var longest_index = 0;
			var longest_height = longest.getHeight();
			for(var j = 1; j < this.children.length; j++) {
				//console.log("Card " + shortest_index + ": " + shortest.height + ", ", "Card " + j + ": " + this.stacks[j].height);
				var stack_height = this.children[j].getHeight();
				if (stack_height > longest_height) {
					longest = this.children[j];
					longest_index = j;
					longest_height = stack_height;
				}  		
			} 
			return longest;
		},
	
		getHeight: function() {
			//console.log('Stacks:getHeight');
			return $(this.el).height();
		},
		
		getAverageHeight: function() {
			var totalHeight;
			_.each(this.children, function(el, i, list) {
				//console.log("New Stack Height(" + i + ")", el.getHeight());
				totalHeight += el.getHeight();
			}, this);
			return totalHeight/this.numStacks;
		}
	});
		
	var StacksController = Backbone.Marionette.Controller.extend({
		
			
		initialize: function(data) {
			this.rootView = new Stacks({stackWidth: 266});	
			this.models = {};
			
			_.each(data, function(item, i, lis) {
				this.models[i] = new CardModel(item);
			}, this);

			//this.collection = new CardCollection(models);
			Stax.vent.on("highThresholdCrossed", this.buildStack, this);
			Stax.vent.on("lowThresholdCrossed", this.destroyStack, this);

			Stax.vent.on("imagePreloaded", this.buildCard, this); 
			Stax.vent.on("cardRendered", this.pushCard, this);
		},
		
		buildCard: function(model) {
			//console.log('buildCard', model.get('name'));
			var card = new Card({model: model});
			
		},
			
		destroyStack: function() {
			//console.log('REMOVE STACK');
			var dead_stack = this.rootView.children.pop();
			dead_stack.$el.remove();

			_.each(dead_stack._views, function(el, i, list) {
				console.log('DeadStack.Children', el);
				el.hide();
				this.pushCard(el, "sink");						
			}, this);

			Stax.vent.trigger('stackDestroyed', dead_stack);			
		},
		
		buildStack: function() {
			//console.log('BUILD NEW STACK');
			var avgHeight = this.rootView.getAverageHeight();			
			var new_stack = this.rootView.pushStack();

			var tallEnough = false;
			do {
				var old_card = this.popCard();
				old_card.hide();
				new_stack.pushCard(old_card, "swim");
				var height = new_stack.getHeight();

				//console.log("New Stack Height: ", height + "/" + avgHeight);
				for (var i = 0; i < this.rootView.numStacks - 1; i++) {
					var sibling_height = this.rootView.children[i].getHeight();
					//console.log("New Stack Height: ", height + "/" + avgHeight + "/" + sibling_height);
					if (height > sibling_height || height > avgHeight) {
						tallEnough = true;
					}
				}
			
			} while(!tallEnough);
		},
			
	
		popCard: function() {
			var longest = this.rootView.getLongestStack();
			var card = longest.popCard();
			console.log('Stacks:removeCard', longest, card);
			return card;
		},
	
		pushCard: function(card, method) {
			console.log('Pushing ' + card.model.get('name'));
			method = method || "push";
			var shortest = this.rootView.getShortestStack();
			shortest.pushCard(card, method);
		}	
		
	});
		
}).call(this);