function addItemToCart(form) {
  const config = {
    method: 'POST',
    headers: {
      Accept: `application/javascript`,
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  const formData = new FormData(form);
  formData.append('sections', 'cart-drawer');
  config.body = formData;

  fetch(theme.routes.cart_add_url, config)
    .then((response) => response.text())
    .then((state) => {
      const parsedState = JSON.parse(state);
      if (parsedState.status) return false;

      document.dispatchEvent(new CustomEvent('THEME_CART_CHANGED', {
        detail: {
          data: parsedState
        }
      }));
    })
}

function getScrollPos () {
  return document.documentElement.scrollTop || document.body.scrollTop;
}

function bindUIEvents () {
	const forms = document.querySelectorAll('.js-adapter-form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addItemToCart(form);
    });
  });

  document.querySelectorAll('.js-adapter-form .js-sticky-cta-frequency-change').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
	  	const form = trigger.closest('.js-adapter-form');
	  	const input = form.querySelector('.js-sticky-cta-frequency input');

	  	if (input) {
	  		var value = parseInt(input.value);
	  		if (trigger.getAttribute('data-mod') == 'minus') {
	  			value --;
	  			if (value < 1) value = 1;
	  		} else {
	  			value ++;
	  		}

	  		input.value = value;
	  	}
    })
  });

  document.querySelectorAll('.js-adapter-dropdown .js-adapter-dropdown-heading').forEach((trigger) => {
  	trigger.addEventListener('click', (e) => {
  		const cover = trigger.closest('.js-adapter-dropdown');

  		cover.classList.toggle('active');
  	});
  });

  document.querySelectorAll('.js-shadow-scroll-wrapper .js-shadow-scroll-content').forEach((content) => {
  	content.addEventListener('scroll', (e) => {
  		const wrapper = content.closest('.js-shadow-scroll-wrapper');
  		const shadowTop = wrapper.querySelector('.shadow--top');
		  const shadowBottom = wrapper.querySelector('.shadow--bottom');
  		contentScrollHeight = content.scrollHeight - wrapper.offsetHeight;

		  var currentScroll = content.scrollTop / contentScrollHeight;
		  if (currentScroll < 0) currentScroll = 0
		  shadowTop.style.opacity = currentScroll;
      if (currentScroll < 0.5) currentScroll = 0.5
		  shadowBottom.style.opacity = 1 - currentScroll;
		});
  });

  document.addEventListener('scroll', (e) => {
    const content = document.querySelector('#content');
    const body = document.querySelector('body');
    if (!content) return false;
    console.log('here')
    console.log(getScrollPos())
    if (getScrollPos() > 0) {
      body.classList.add('scrolled');
    } else {
      body.classList.remove('scrolled');
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
	bindUIEvents();
});
