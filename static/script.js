document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const ingredientsInput = document.getElementById('ingredients');
    const loadingDiv = document.getElementById('loading');
    const recipeContainer = document.getElementById('recipeContainer');
    const recipeContent = document.getElementById('recipeContent');
    const errorContainer = document.getElementById('errorContainer');
    const errorContent = document.getElementById('errorContent');

    generateBtn.addEventListener('click', async () => {
        const ingredients = ingredientsInput.value.trim();
        
        if (!ingredients) {
            alert("Please enter some ingredients first!");
            return;
        }

        // Reset UI states
        recipeContainer.classList.add('hidden');
        errorContainer.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Cooking...';

        try {
            const response = await fetch('/api/recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients: ingredients })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "An unknown error occurred.");
            }

            // Parse Markdown response using generic marked library
            recipeContent.innerHTML = marked.parse(data.recipe);
            recipeContainer.classList.remove('hidden');

        } catch (error) {
            errorContent.textContent = "Oops! Something went wrong: " + error.message;
            errorContainer.classList.remove('hidden');
        } finally {
            loadingDiv.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Recipe';
        }
    });
});
