const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const slider = {
  wrappers: [],
  sliderMains: [],
  sliderSubs: [],
  sliderRows: [],
  sliderLists: [],
  sliderItems: [],
  sliderNexts: [],
  sliderPreviouss: [],
  sliderLength: [],
  sliderCol: [],
  sliderGap: [],
  currentPosition: [],
  currentItem: [],
  setDataIndex() {
    this.wrappers.forEach((wrapper, index) => {
      wrapper.dataset.sliderIndex = index;
    });
    this.sliderItems.forEach((sliderItem) => {
      sliderItem.forEach((item, index) => {
        item.dataset.itemIndex = index;
      });
    });
  },
  switchImage(index) {
    if (this.currentItem[index] >= this.sliderLength[index] - this.sliderCol[index] || this.currentItem[index] <= 0) {
      if (this.currentItem[index] >= this.sliderLength[index] - this.sliderCol[index]) {
        this.currentItem[index] = this.sliderLength[index] - this.sliderCol[index];
        this.sliderNexts[index] && this.sliderNexts[index].classList.add("disabled");
        this.sliderPreviouss[index] && this.sliderPreviouss[index].classList.remove("disabled");
      } else {
        this.currentItem[index] = 0;
        this.sliderPreviouss[index] && this.sliderPreviouss[index].classList.add("disabled");
        this.sliderNexts[index] && this.sliderNexts[index].classList.remove("disabled");
      }
    } else {
      this.sliderPreviouss[index] && this.sliderPreviouss[index].classList.remove("disabled");
      this.sliderNexts[index] && this.sliderNexts[index].classList.remove("disabled");
    }
    this.currentPosition[index] = `calc(((100% / ${this.sliderCol[index]}) + (${this.sliderGap[index]} / ${this.sliderCol[index]}))*${this.currentItem[index]}*(-1))`;
    this.sliderLists[index].style.left = `${this.currentPosition[index]}`;
  },
  handleEvents() {
    // next event
    if (this.sliderNexts && this.sliderNexts.length > 0) {
      this.sliderNexts.forEach((sliderNext, index) => {
        if (sliderNext) {
          sliderNext.onclick = () => {
            if (!sliderNext.classList.contains("disabled")) {
              this.currentItem[index]++;
              this.switchImage(index);
            }
          };
        }
      });
    }

    // previous event
    if (this.sliderPreviouss && this.sliderPreviouss.length > 0) {
      this.sliderPreviouss.forEach((sliderPrevious, index) => {
        if (sliderPrevious) {
          sliderPrevious.onclick = () => {
            if (!sliderPrevious.classList.contains("disabled")) {
              this.currentItem[index]--;
              this.switchImage(index);
            }
          };
        }
      });
    }

    // slider sub event
    if (this.sliderSubs && this.sliderSubs.length > 0) {
      this.sliderSubs.forEach((sliderSub) => {
        sliderSub.onclick = (e) => {
          const sliderMainIndex = sliderSub.dataset.sliderIndex - 1;
          const selectedItem = e.target.closest(".slider-item");
          if (selectedItem) {
            this.currentItem[sliderMainIndex] = selectedItem.dataset.itemIndex;
            this.switchImage(sliderMainIndex);
          }
        };
      });
    }
  },
  init() {
    this.wrappers = Array.from($$(".slider"));

    // Create previous and next button
    // this.wrappers.forEach((wrapper) => {
    //   if (!wrapper.classList.contains("n-btn")) {
    //     const htmls = `
    //               <div class="slider-control">
    //                   <div class="slider-button slider-previous">
    //                       <i class="fas fa-chevron-left"></i>
    //                   </div>
    //                   <div class="slider-button slider-next">
    //                       <i class="fas fa-chevron-right"></i>
    //                   </div>
    //               </div>
    //           `;
    //     wrapper.innerHTML += htmls;
    //   }
    // });

    // Get slider
    this.sliderMains = Array.from($$(".slider.slider-main"));
    this.sliderSubs = Array.from($$(".slider.slider-sub"));
    this.sliderRows = Array.from($$(".slider-row"));
    this.sliderLists = Array.from($$(".slider-list"));

    // Get items in slider list
    this.sliderItems = []
    this.sliderNexts = []
    this.sliderPreviouss = []
    
    this.sliderLists.forEach((sliderList, index) => {
      
      const currentSliderItems = Array.from(sliderList.querySelectorAll(".slider-item"));
      this.sliderItems = [...this.sliderItems, currentSliderItems];
      this.sliderLength[index] = currentSliderItems.length;
      this.sliderCol[index] = Number(sliderList.dataset.col) || 1;
      this.sliderGap[index] = sliderList.dataset.gap || "0px";
      this.currentPosition[index] = "0";
      this.currentItem[index] = this.currentItem[index] ? this.currentItem[index] : 0;
      
      sliderList.style.marginLeft = `-${this.sliderGap[index]}`;
      
      if (this.sliderLength[index] > 1) {
        if (!this.wrappers[index].classList.contains("n-btn")) {
          const htmls = `
                      <div class="slider-control">
                        <div class="slider-button slider-previous">
                          <i class="fas fa-chevron-left"></i>
                        </div>
                        <div class="slider-button slider-next">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                      </div>
                  `;
          //  wrapper.innerHTML += htmls;
          this.wrappers[index].insertAdjacentHTML('beforeend', htmls);

          this.sliderNexts.push(this.wrappers[index].querySelector(".slider-next"));
          this.sliderPreviouss.push(this.wrappers[index].querySelector(".slider-previous"));
        } else {
          this.sliderNexts.push(null);
          this.sliderPreviouss.push(null);
        }
      }

      // Setup for slider item
      currentSliderItems.forEach((currentSliderItem) => {
        currentSliderItem.style.flexBasis = `calc((100% / ${this.sliderCol[index]}) - ${this.sliderGap[index]})`;
        currentSliderItem.style.flexShrink = `0`;
        currentSliderItem.style.marginLeft = `${this.sliderGap[index]}`;
      });

      // Set disabled for previous and next button
      if (this.sliderLength[index] > 1) {
        if (this.sliderPreviouss[index]) {
          this.sliderPreviouss[index].classList.add("disabled");
        }
        if (this.sliderNexts[index]) {
          if (this.sliderLength[index] <= this.sliderCol[index]) {
            this.sliderNexts[index].classList.add("disabled");
          }
        }
      }
    });
    this.setDataIndex();
    this.handleEvents();
    for (let index = 0; index < this.sliderLists.length; index++) {
      if (this.currentItem[index]) {
        this.switchImage(index);
      } 
    }
  },
};

export default slider;
