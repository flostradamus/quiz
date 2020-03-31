'use strict'
window.addEventListener('load', () => {
    let quizs = document.querySelectorAll('.quiz');

    for (let i = 0; i < quizs.length; i++) {
        //Получаем все необходимое из doma
        let quiz = quizs[i];
        let slider = quiz.querySelector('.quiz_slider');
        let wrapper_slider = quiz.querySelector('.wrapper_quiz_slider');
        let quiz_answers = quiz.querySelectorAll('.quiz_answer');
        let quiz_content = quiz.querySelector('.quiz_content');
        let quiz_answer_width = parseInt(getComputedStyle(quiz_answers[0]).flexBasis);
        let quiz_content_padding = parseInt(getComputedStyle(quiz_content).paddingLeft);
        let slider_transition = getComputedStyle(slider).transition;
        //Количество отступов - элементов справа
        let number_margin_right = 0;
        //Отступы контента квиза, когда видимый только один ответ и он не помещается
        let quiz_content_padding_small = 10;
        //Создаем и вставляем стрелочки в квиз
        let arroy_left = document.createElement('i');
        let arroy_right = document.createElement('i');
        arroy_left.classList.add('fas', 'fa-chevron-left');
        arroy_right.classList.add('fas', 'fa-chevron-right');
        wrapper_slider.insertAdjacentElement('afterbegin', arroy_left);
        wrapper_slider.insertAdjacentElement('afterbegin', arroy_right);

        window.onresize = () => {
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
                    quiz.querySelector('.quiz_slider').style.width = 100 * (quiz_answers.length / visible_answers) + '%';


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
        }

        window.dispatchEvent(new Event("resize"));

    }
});