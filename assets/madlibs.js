;(function(window, document, undefined) {

  // UI

  function UI(initial_prompt) {
    this.updatePrompt = function(type) {
      var article = 'a' + (type.match(/^[aeo]/i) ? 'n' : '');
      prompt.innerHTML = article + ' <em class="word-class">' + type + '</em>';
    };

    this.clearInput = function() {
      input.value = '';
    };

    var form   = document.querySelector('form.mad-libs'),
        prompt = form.querySelector('.prompt'),
        input  = form.querySelector('input#word');

    form.addEventListener('submit', function(evt) {
      evt.preventDefault();
      this.onSubmit.call(this, input.value);
      this.clearInput();
    }.bind(this));

    this.onSubmit = function() { };
    this.updatePrompt(initial_prompt);
  }

  // Story

  function Story(text) {
    var MUSTACHE_REGEX = /{{\s?([^}]*)\s?}}/g,
        parsed = text.split(MUSTACHE_REGEX),
        blanks = [],
        current_blank = 1;

    this.fillBlank = function(fill_with) {
      blanks.push(fill_with);
      current_blank += 2;
    };

    this.getNextBlank = function() {
      var blank = parsed[current_blank];
      return blank ? blank.split(':')[0] : false;
    };

    this.compile = function() {
      var index = 0;
      return text.replace(MUSTACHE_REGEX, function() {
        return blanks[index++];
      });
    };
  }

  // App

  var router,
      template,
      story;

  function init(evt) {
    story    = new Story(window.STORIES[0]);
    template = new UI(story.getNextBlank());
    template.onSubmit = enteredWord;
  }

  function enteredWord(word) {
    story.fillBlank(word);
    var next = story.getNextBlank();

    if (next) {
      template.updatePrompt(next);
    } else {
      console.log('Your Story:');
      console.log(story.compile());
    }
  }

  document.addEventListener('DOMContentLoaded', init);

})(window, document);
