'use strict'
//Отступы контента квиза, когда видимый только один ответ и он не помещается
let quiz_content_padding_small = 10;
let quiz_progressbar_margin_start = 26;
window.addEventListener('load', () => {
    let quiz_buttons = document.querySelectorAll('.quiz_button');
    let quizs = document.querySelectorAll('.quiz');
    for (let i = 0; i < quiz_buttons.length; i++) {
        let quiz_button = quiz_buttons[i];
        let quiz = quizs[i];

        quiz_button.addEventListener('click', () => {
            let quiz_steps = quiz.querySelectorAll('.quiz_step');
            let quiz_progressbar = quiz.querySelector('.quiz_progressbar');
            let quiz_button_wrapper = quiz.querySelector('.quiz_button_wrapper');
            let quiz_button_next = quiz_button_wrapper.querySelector('.quiz_button_next');
            let quiz_button_back = quiz_button_wrapper.querySelector('.quiz_button_back');
            let quiz_step_scale = getComputedStyle(quiz_steps[1]).transform;
            let quiz_start_page_button = quiz.querySelector('.quiz_start_page_button');
            let quiz_content = quiz.querySelector('.quiz_content');
            let quiz_content_clone = quiz_content.cloneNode(true);
            let quiz_start_page = quiz_content.querySelector('.quiz_start_page');
            let quiz_start_page_image = quiz_start_page.querySelector('img');
            let quiz_start_page_content = quiz_start_page.querySelector('.quiz_start_page_content');
            let quiz_end_page = quiz_content.querySelector('.quiz_end_page');
            let quiz_left_block = quiz_end_page.querySelector('.quiz_left_block');
            let quiz_right_block = quiz_end_page.querySelector('.quiz_right_block');
            let quiz_end_page_content = quiz_end_page.querySelector('.quiz_end_page_content');
            let quiz_close = quiz_content.querySelector('.quiz_close');
            let quiz_progressbar_text = quiz_content.querySelector('.quiz_progressbar_text span');
            let quiz_progressbar_filling = quiz_content.querySelector('.quiz_progressbar_filling');
            quiz.style.display = 'flex';
            let procent_step = Math.trunc(100 / quiz_steps.length);
            let procent = 0;
            //Количество отступов - элементов справа
            let number_margin_right = 0;
            //Активный шаг
            let active_step = 0;
            let active_quiz_step = quiz_steps[active_step];

            function get_quiz_progressbar_margin() {
                return parseInt(getComputedStyle(quiz_button_wrapper).width) + quiz_progressbar_margin_start + 'px';
            }

            function view_next_quiz_step() {
                setTimeout(() => {
                    active_quiz_step = quiz_steps[active_step];
                    active_quiz_step.style.display = "block";
                    number_margin_right = 0;
                    window.dispatchEvent(new Event("resize"));
                    active_quiz_step.style.transform = 'scale(1)';
                }, 300);
            }

            function felling_progressbar() {
                quiz_progressbar_text.innerText = procent;
                quiz_progressbar_filling.style.width = procent;
            }

            function hidden_prev_quiz_step() {
                active_quiz_step.style.transform = quiz_step_scale;
                setTimeout(() => {
                    active_quiz_step.style.display = "none";
                }, 300);
            }

            function quiz_button_next_click() {
                procent = parseInt(quiz_progressbar_text.innerText) + procent_step + '%';
                quiz_button_back.removeAttribute('disabled');

                hidden_prev_quiz_step();
                felling_progressbar();
                active_step++;
                if (active_step == quiz_steps.length - 1) {
                    quiz_button_next.innerText = "Последний шаг";
                    quiz_progressbar.style.marginRight = get_quiz_progressbar_margin();
                    quiz_button_next.onclick = () => {
                        quiz_close.style.color = 'grey';
                        quiz_end_page.style.width = '100%';
                        quiz_content.style.overflow = 'hidden';
                        quiz_left_block.style.transform = 'translateX(0%)';
                        quiz_right_block.style.transform = 'translateX(0%)';
                        setTimeout(() => {
                            quiz_end_page_content.style.opacity = '1';
                        }, 300);
                    }
                }
                view_next_quiz_step();
            }

            function quiz_button_back_click() {
                procent = parseInt(quiz_progressbar_text.innerText) - procent_step + '%';
                quiz_button_next.innerText = "Далее";
                quiz_progressbar.style.marginRight = get_quiz_progressbar_margin();
                quiz_button_next.onclick = quiz_button_next_click;

                hidden_prev_quiz_step();
                felling_progressbar();

                active_step--;
                if (!active_step) {
                    quiz_button_back.setAttribute('disabled', '');
                }
                view_next_quiz_step();
            }
            quiz_button_next.onclick = quiz_button_next_click;

            quiz_button_back.addEventListener('click', quiz_button_back_click);

            quiz_start_page_button.addEventListener('click', () => {
                quiz_button_back.setAttribute('disabled', '');
                quiz_start_page.style.backgroundColor = 'unset';
                quiz_start_page_image.style.transform = 'translateX(-100%)';
                quiz_start_page_content.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    quiz_content.style.overflow = 'auto';
                    quiz_start_page.style.display = 'none';
                }, 700);
            });

            quiz_close.onclick = () => {
                quiz.style.display = 'none';
                quiz_content.remove();
                quiz.insertAdjacentElement('afterbegin', quiz_content_clone);
            };

            window.addEventListener('resize', () => {
                let wrapper_slider = active_quiz_step.querySelector('.wrapper_quiz_slider');
                let arroy_left = wrapper_slider.querySelector('.fa-chevron-left');
                let arroy_right = wrapper_slider.querySelector('.fa-chevron-right');
                let slider = wrapper_slider.querySelector('.quiz_slider');
                let quiz_answers = slider.querySelectorAll('.quiz_answer');
                let quiz_answer_width = parseInt(getComputedStyle(quiz_answers[0]).flexBasis);
                let slider_transition = getComputedStyle(slider).transition;
                let wrapper_slider_width = wrapper_slider.offsetWidth;
                for (let j = 1; j <= quiz_answers.length + 1; j++) {
                    if (wrapper_slider_width < quiz_answer_width * j) {
                        slider.style.transition = 'none';
                        let visible_answers = j - 1;
                        let invisible_answers = quiz_answers.length - visible_answers;
                        let number_answers_right = invisible_answers - number_margin_right;
                        let number_answers_left = number_margin_right;

                        slider.style.width = 100 * (quiz_answers.length / visible_answers) + '%';


                        if (number_margin_right > invisible_answers) {
                            number_margin_right -= number_margin_right - invisible_answers;
                        }

                        slider.style.right = (wrapper_slider_width / visible_answers) * number_margin_right + 'px';

                        if (invisible_answers == 0) {
                            arroy_right.style.display = 'none';
                            arroy_left.style.display = 'none';
                        } else {
                            if (number_margin_right < invisible_answers) {
                                arroy_right.style.display = 'flex';
                            } else {
                                arroy_right.style.display = 'none';
                            }

                            if (number_margin_right > 0) {
                                arroy_left.style.display = 'flex';
                            } else {
                                arroy_left.style.display = 'none';
                            }
                        }

                        arroy_right.onclick = () => {
                            if (number_answers_right >= visible_answers) {
                                number_margin_right += visible_answers;
                            } else {
                                number_margin_right += invisible_answers;
                            }
                            window.dispatchEvent(new Event("resize"));

                            slider.style.transition = slider_transition;

                        }

                        arroy_left.onclick = () => {
                            if (number_answers_left >= visible_answers) {
                                number_margin_right -= visible_answers;
                            } else {
                                number_margin_right = 0;
                            }
                            window.dispatchEvent(new Event("resize"));

                            slider.style.transition = slider_transition;

                        }

                        break;
                    }
                }
            });

            window.dispatchEvent(new Event("resize"));

        });
    }
});