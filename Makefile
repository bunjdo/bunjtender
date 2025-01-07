deploy-hosting:
	nvm use 20
	npm run build
	firebase deploy --only hosting

deploy-functions:
	nvm use 20
	firebase deploy --only funstions
