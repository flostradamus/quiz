'use strict'
//Отступы контента квиза, когда видимый только один ответ и он не помещается
let quiz_content_padding_small = 10;
let quiz_progressbar_margin_start = 26;
window.addEventListener('load', () => {
    let quizs = document.querySelectorAll('.quiz');

    for (let i = 0; i < quizs.length; i++) {
        //Получаем все необходимое из doma
        let quiz = quizs[i];
        let quiz_content = quiz.querySelector('.quiz_content');
        let quiz_content_padding = parseInt(getComputedStyle(quiz_content).paddingLeft);
        let quiz_steps = quiz.querySelectorAll('.quiz_step');
        let quiz_progressbar = quiz.querySelector('.quiz_progressbar');
        let quiz_button_wrapper = quiz.querySelector('.quiz_button_wrapper');
        let quiz_button = quiz_button_wrapper.querySelector('.quiz_button');
        let quiz_button_back = quiz_button_wrapper.querySelector('.quiz_button_back');

        let quiz_step_scale = getComputedStyle(quiz_steps[1]).transform;
        //Количество отступов - элементов справа
        let number_margin_right = 0;
        //Активный шаг
        let active_step = 0;
        let active_quiz_step = quiz_steps[active_step];

        function get_quiz_progressbar_margin() {
            return parseInt(getComputedStyle(quiz_button_wrapper).width) + quiz_progressbar_margin_start + 'px';
        }

        function view_next_quiz_step() {
            quiz_steps[active_step].style.display = "block";
            number_margin_right = 0;
            active_quiz_step = quiz_steps[active_step];
            window.dispatchEvent(new Event("resize"));
            active_quiz_step.style.transform = 'scale(1)';
        }
        quiz_button.addEventListener('click', () => {
            quiz_button_back.removeAttribute('disabled');

            active_quiz_step.style.transform = quiz_step_scale;
            setTimeout(() => {
                quiz_steps[active_step].style.display = "none";
                active_step++;
                if (active_step == quiz_steps.length - 1) {
                    quiz_button.innerText = "Последний шаг";
                    quiz_progressbar.style.marginRight = get_quiz_progressbar_margin();
                }
                view_next_quiz_step();
            }, 250);
        });
        quiz_button_back.addEventListener('click', () => {
            quiz_button.innerText = "Далее";
            quiz_progressbar.style.marginRight = get_quiz_progressbar_margin();

            active_quiz_step.style.transform = quiz_step_scale;
            setTimeout(() => {
                quiz_steps[active_step].style.display = "none";
                active_step--;
                if (!active_step) {
                    quiz_button_back.setAttribute('disabled', '');
                }
                view_next_quiz_step();
            }, 250);
        });

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
                    //Если только один ответ видимый и он не помещяеться
                    if (j == 1) {
                        //Уменьшаем падинги контента
                        quiz_content.style.paddingLeft = quiz_content_padding_small + 'px';
                        quiz_content.style.paddingRight = quiz_content_padding_small + 'px';
                        j++;
                    } else if (wrapper_slider_width - (quiz_content_padding - quiz_content_padding_small) * 2 > quiz_answer_width) {
                        //Иначе увеличиваем падинги до предыдущего состояния
                        quiz_content.style.paddingLeft = quiz_content_padding + 'px';
                        quiz_content.style.paddingRight = quiz_content_padding + 'px';
                    }
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

    }
});