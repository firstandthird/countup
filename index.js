import Domodule from 'domodule';
import { once } from 'domassist';

const MIN_TIMER = 50;

function animateNumber({ target, start = 0, duration, callback = () => {}, interval }) {
  const range = target - start;
  let stepTime = Math.abs(Math.floor(duration / range));

  stepTime = Math.max(stepTime, MIN_TIMER);

  // get current time and calculate desired end time
  const startTime = new Date().getTime();
  const endTime = startTime + duration;

  function run(timer) {
    const now = new Date().getTime();
    const remaining = Math.max((endTime - now) / duration, 0);
    const value = Math.round(target - (remaining * range));

    interval(value.toLocaleString());

    if (value === target) {
      clearInterval(timer);
      return callback();
    }
  }

  const timer = setInterval(() => run(timer), stepTime);
}

class Countup extends Domodule {
  get defaults() {
    return {
      delay: 0,
      start: 0,
      duration: 700,
      template: '$D'
    };
  }

  get required() {
    return {
      options: ['target']
    };
  }

  postInit() {
    const numerics = ['delay', 'target', 'start', 'duration'];
    this.reset();

    numerics.forEach(option => {
      this.options[option] = parseInt(this.options[option], 10);

      if (this.options[option] !== this.options[option]) {
        throw new Error(`${option} value is not valid: ${this.options[option]}`);
      }
    });

    if (this.el.hasAttribute('data-scroll')) {
      const className = this.el.dataset.scrollClass;

      if (this.el.classList.contains(className)) {
        this.start();
      } else {
        once(this.el, 'scrolltriggers:inView', this.start.bind(this));
      }
    }
  }

  reset() {
    this.el.innerHTML = this.getText(this.options.start);
  }

  start() {
    setTimeout(() => {
      animateNumber({
        target: this.options.target,
        start: this.options.start,
        duration: this.options.duration,
        interval: value => {
          this.el.innerHTML = this.getText(value);
        }
      });
    }, this.options.delay);
  }

  getText(number) {
    return this.options.template.replace(/\$D/g, number);
  }
}

Domodule.register('Countup', Countup);

export default Countup;
export { animateNumber };
