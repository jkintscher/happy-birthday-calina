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

    this.revealStory = function(text) {
      form.classList.add('complete');
      story.innerHTML = text;
    };

    var form   = document.getElementById('mad-libs'),
        story  = document.querySelector('#story .content'),
        prompt = form.querySelector('.prompt'),
        input  = form.querySelector('input#word');

    form.addEventListener('submit', function(evt) {
      evt.preventDefault();
      this.onSubmit.call(this, input.value);
      this.clearInput();
    }.bind(this));

    story.parentNode.querySelector('a.start-over').addEventListener('click', function(evt) {
      evt.preventDefault();
      window.location.reload();
    });

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

    this.getCurrentBlank = function() {
      var blank = parsed[current_blank];
      return blank ? blank.split(':')[0] : false;
    };

    this.compile = function() {
      var index = 0;
      return text.replace(MUSTACHE_REGEX, function(match, submatch) {
        var original = submatch.split(':')[1];
        return '<i title="' + original + '">' + blanks[index++] + '</i>';
      });
    };
  }

  // App

  var template,
      story;

  function init(evt) {
    story    = new Story(window.STORY);
    template = new UI(story.getCurrentBlank() || '');
    template.onSubmit = enteredWord;
  }

  function enteredWord(word) {
    story.fillBlank(word);
    var next = story.getCurrentBlank();

    if (next) {
      template.updatePrompt(next);
    } else {
      template.revealStory(story.compile());
    }
  }

  document.addEventListener('DOMContentLoaded', init);

})(window, document);
