;(function () {
  'use strict';

  angular
   .module('app.projects')
   .directive('card', card);

  /* @ngInject */
  function card(ProjectService) {
    return {
      restrict: 'E',
      template: `
        <div class="card">
          <div class="card__container card__container--closed">
            <svg class="card__image"
              xmlns="http://www.w3.org/2000/svg" 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 1920 1200"
              preserveAspectRatio="xMidYMid slice">
              <defs>
                <clipPath id="clipPath1">
                  <polygon class="clip" points="0,1200 0,0 1920,0 1920,1200"></polygon>
                </clipPath>
              </defs>
              <image 
                clip-path="url(#clipPath1)" 
                width="1920" 
                height="1200" 
                xlink:href="img/g.jpg">
              </image>
            </svg>
            <div class="card__content">
              <i class="card__btn-close fa fa-times"></i>
              <div class="card__caption">
                <h2 class="card__title">Tristan and Isolde</h2>
                <p class="card__subtitle">A modern day love story</p>
              </div>
              <div class="card__copy">
                <div class="meta">
                  <img class="meta__avatar" src="img/authors/1.png" alt="author01" />
                  <span class="meta__author">Gerry Sutherland</span>
                  <span class="meta__date">06/19/2015</span>
                </div>
                <p>Business model canvas bootstrapping deployment startup. In A/B testing pivot niche market alpha conversion
                  startup down monetization partnership business-to-consumer success for investor mass market business-to-business.</p>
                <p>Release creative social proof influencer iPad crowdsource gamification learning curve network effects monetization.
                  Gamification business plan mass market www.discoverartisans.com direct mailing ecosystem seed round sales
                  long tail vesting period.</p>
                <p>Product management ramen bootstrapping seed round venture holy grail technology backing partner network entrepreneur
                  beta marketing value proposition. Android stealth conversion scrum project network effects. Creative alpha
                  long tail conversion stealth growth hacking iteration investor A/B testing prototype customer. Startup www.discoverartisans.com
                  direct mailing launch party partnership market ramen metrics focus value proposition.</p>
                <p>Stock infrastructure seed round sales paradigm shift technology user experience focus gamification. Partnership
                  metrics business plan stealth business-to-business. Deployment graphical user interface monetization. Twitter
                  incubator scrum project entrepreneur branding burn rate ramen backing paradigm shift virality crowdsource.</p>
                <p>Social proof MVP ecosystem. Ramen launch party pitch deployment stealth. Vesting period MVP equity. Focus creative
                  partnership founders iteration agile development infographic.</p>
                <p>Low hanging fruit burn rate innovator user experience niche market A/B testing creative launch party product
                  management release. Www.discoverartisans.com influencer business model canvas user experience gamification
                  paradigm shift startup research &amp; development iPad agile development. Strategy incubator infographic
                  success marketing buzz A/B testing responsive web design. Traction research &amp; development pitch seed
                  money venture niche market accelerator network effects.</p>
              </div>
            </div>
          </div>
        </div>
      `,
      scope: {},
      bindToController: {
      },
      controller: Controller,
      controllerAs: 'dm',
      link: link
    };

    function link(scope, element) {
      //ProjectService._bindCard()
      console.log('index', element[0].getAttribute('index'));
    }
  }

  /* @ngInject */
  function Controller() {
    var dm = this;

  }
})();