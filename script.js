'use strict';

let persons = [];
let cities = [];
let specializations = [];

// Функция для вывода результатов на страницу
function displayResult(title, content, sectionId = 'results-container') {
    const container = document.getElementById(sectionId);
    const resultElement = document.createElement('div');
    resultElement.className = 'task-section';
    resultElement.innerHTML = `
        <h2>${title}</h2>
        <div>${content}</div>
    `;
    container.appendChild(resultElement);
    
    // Также выводим в консоль для отладки
    console.log(`${title}:`, content);
}

function getInfo() {
    return `${this.firstName} ${this.lastName}, ${this.city}`;
}

function processData() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '<h1>Результаты анализа кандидатов</h1>';

    let designer = specializations.find(item => item.name.toLowerCase() === 'designer');
    let developerFront = specializations.find(item => item.name.toLowerCase() === 'frontend');
    let developerBack = specializations.find(item => item.name.toLowerCase() === 'backend');
    let firstReactDeveloperFound = false;
    let allAdults = true;

    // Task 2: Все кандидаты
    let allCandidatesHTML = '<ul class="candidate-list">';
    persons.forEach((person) => {
        let personalData = person.personal;
        let personCity = cities.find(city => city.id === personalData.locationId);
        if (personCity) {
            personalData.city = personCity.name;
        }
        let personData = getInfo.call(personalData);
        allCandidatesHTML += `<li>${personData}</li>`;
    });
    allCandidatesHTML += '</ul>';
    displayResult('Задание 2: Все кандидаты', allCandidatesHTML);

    // Task 3: Дизайнеры Figma
    let figmaDesignersHTML = '<ul class="candidate-list">';
    persons.forEach((person) => {
        let personalData = person.personal;
        let personSkills = person.skills;
        let figmaSkill = personSkills.find(skill => skill.name.toLowerCase() === 'figma');
        
        if (figmaSkill && personSkills && personalData.specializationId === designer.id) {
            let figmaDesigner = getInfo.call(personalData);
            figmaDesignersHTML += `<li>${figmaDesigner}</li>`;
        }
    });
    figmaDesignersHTML += '</ul>';
    displayResult('Задание 3: Дизайнеры Figma', figmaDesignersHTML);

    // Task 4: Первый разработчик React
    let reactDeveloperHTML = '<p>Не найден</p>';
    persons.forEach((person) => {
        if (!firstReactDeveloperFound) {
            let personalData = person.personal;
            let personSkills = person.skills;
            let reactSkill = personSkills.find(skill => skill.name.toLowerCase() === 'react');
            
            if (reactSkill && (personalData.specializationId === developerFront.id || personalData.specializationId === developerBack.id)) {
                let firstReactDeveloper = getInfo.call(personalData);
                reactDeveloperHTML = `<p class="success">${firstReactDeveloper}</p>`;
                firstReactDeveloperFound = true;
            }
        }
    });
    displayResult('Задание 4: Первый разработчик React', reactDeveloperHTML);

    // Task 5: Проверка совершеннолетия
    function isAdultPerson() {
        const birthday = this.birthday;
        const [day, month, year] = birthday.split('.');
        const birthDate = new Date(year, month - 1, day);
        let currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        let monthDiff = currentDate.getMonth() - birthDate.getMonth();
        let dayDiff = currentDate.getDate() - birthDate.getDate();
        
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        return age >= 18;
    }

    let adultsHTML = '<ul class="candidate-list">';
    persons.forEach(person => {
        let personalData = person.personal;
        let isPersonAdult = isAdultPerson.call(personalData);
        if (!isPersonAdult) {
            allAdults = false;
            adultsHTML += `<li class="warning">${getInfo.call(personalData)} - несовершеннолетний</li>`;
        }
    });
    
    if (allAdults) {
        adultsHTML = '<p class="success">Все кандидаты совершеннолетние</p>';
    } else {
        adultsHTML += '</ul>';
    }
    displayResult('Задание 5: Проверка совершеннолетия', adultsHTML);

    // Task 6: Backend-разработчики из Москвы
    let moscowCity = cities.find(city => city.name.toLowerCase() === 'москва');
    let backDevelopersMoscow = persons.filter(person => {
        const { personal: { specializationId, locationId } } = person;
        return specializationId === developerBack.id && locationId === moscowCity.id;
    });
    
    let developersSalaryRequest = [];
    backDevelopersMoscow.forEach(backDeveloper => {
        let employmentType = backDeveloper.request.find(item => item.name.toLowerCase() === 'тип занятости');
        if (employmentType && employmentType.value.toLowerCase() === 'полная') {
            let backDeveloperFromMoscow = getInfo.call(backDeveloper.personal);
            let salaryExpectations = backDeveloper.request.find(item => item.name.toLowerCase() === 'зарплата');
            if (salaryExpectations && typeof salaryExpectations.value === 'number') {
                developersSalaryRequest.push({
                    person: backDeveloperFromMoscow,
                    specialization: developerBack.name,
                    salaryRequest: salaryExpectations.value,
                });
            }
        }
    });
    
    developersSalaryRequest.sort(function(a, b) {
        return a.salaryRequest - b.salaryRequest;
    });
    
    let salaryHTML = '<div>';
    developersSalaryRequest.forEach(developer => {
        salaryHTML += `
            <div class="salary-item">
                <span>${developer.person}</span>
                <span class="salary-amount">${developer.salaryRequest} $</span>
            </div>
        `;
    });
    salaryHTML += '</div>';
    displayResult('Задание 6: Backend-разработчики из Москвы (полная занятость)', salaryHTML);

    // Task 7: Крутые дизайнеры
    let designersHighQuality = persons.filter(person => {
        const { personal: { specializationId }, skills } = person;
        const isDesigner = specializationId === designer.id && person.skills.length > 0;
        if (isDesigner) {
            const photoshopSkill = skills.some(skill => skill.name.toLowerCase() === 'photoshop' && skill.level >= 6);
            const figmaSkill = skills.some(skill => skill.name.toLowerCase() === 'figma' && skill.level >= 6);
            return photoshopSkill && figmaSkill;
        }
        return false;
    });
    
    let topDesignersHTML = '<ul class="candidate-list">';
    designersHighQuality.forEach(designerPerson => {
        let personalData = getInfo.call(designerPerson.personal);
        topDesignersHTML += `<li>${personalData}</li>`;
    });
    topDesignersHTML += '</ul>';
    displayResult('Задание 7: Дизайнеры с Photoshop ≥6 и Figma ≥6', topDesignersHTML);

    // Task 8: Команда для проекта
    function isBestSkillPerson(skillName) {
        const filterPersons = persons.filter(person => {
            return person.skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase());
        });
        if (filterPersons.length === 0) {
            return null;
        }
        return filterPersons.reduce((bestPerson, currentPerson) => {
            let bestLevel = bestPerson.skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase()).level;
            let currentLevel = currentPerson.skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase()).level;
            return bestLevel > currentLevel ? bestPerson : currentPerson;
        });
    }

    const bestFigmaDesigner = isBestSkillPerson('Figma');
    const bestFrontendDeveloperAngular = isBestSkillPerson('angular');
    const bestBackDeveloperGo = isBestSkillPerson('go');

    let teamHTML = '<div class="team-section">';
    if (bestFigmaDesigner) {
        teamHTML += `<div class="team-member">Дизайнер: ${getInfo.call(bestFigmaDesigner.personal)}</div>`;
    }
    if (bestFrontendDeveloperAngular) {
        teamHTML += `<div class="team-member">Frontend: ${getInfo.call(bestFrontendDeveloperAngular.personal)}</div>`;
    }
    if (bestBackDeveloperGo) {
        teamHTML += `<div class="team-member">Backend: ${getInfo.call(bestBackDeveloperGo.personal)}</div>`;
    }
    teamHTML += '</div>';
    
    displayResult('Задание 8: Команда для разработки проекта', teamHTML);
}

// Загрузка данных
Promise.all([
    fetch('person.json'),
    fetch('cities.json'),
    fetch('specializations.json'),
]).then(async ([personsResponse, citiesResponse, specializationsResponse]) => {
    const personsJson = await personsResponse.json();
    const citiesJson = await citiesResponse.json();
    const specializationsJson = await specializationsResponse.json();
    return [personsJson, citiesJson, specializationsJson];
}).then(response => {
    persons = response[0];
    cities = response[1];
    specializations = response[2];
    processData();
}).catch(error => {
    console.error('Ошибка загрузки данных:', error);
    displayResult('Ошибка', 'Не удалось загрузить данные');
});