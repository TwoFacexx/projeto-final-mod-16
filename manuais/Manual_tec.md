
Índice

Tecnologias Utilizadas
Estrutura do Projeto
Instalação e Configuração
API e Funcionalidades
Manutenção
Segurança
Problemas Comuns e Soluções













Introdução

Este manual destina-se a programadores e técnicos que queiram compreender a estrutura da aplicação e como mantê-la.



Tecnologias Utilizadas

Backend: Python (Flask)

Frontend: HTML, CSS, JavaScript

Armazenamento: Diretório local para uploads de imagens

Bibliotecas utilizadas: Flask, Pillow (para manipulação de imagens)



Estrutura do Projeto

projeto-final/
|-- app.py  # Código principal do servidor Flask
|-- templates/
|   |-- index.html  # Interface principal
|-- static/
|   |-- css/
|   |   |-- styles.css  # Estilos da aplicação
|   |-- js/
|   |   |-- createImage.js  # Função para manipular imagens
|   |   |-- handleUpload.js  # Função para gerir uploads
|   |-- uploads/  # Diretório onde as imagens enviadas são armazenadas







Instalação e Configuração

Instale Python 3.x e Flask (pip install flask).

Instale a biblioteca Pillow para manipulação de imagens (pip install pillow).

No terminal, navegue até a pasta do projeto e execute python app.py.

Aceda ao endereço http://127.0.0.1:5000/ no navegador.



API e Funcionalidades

Aceda à aplicação e carregue uma imagem através do botão "Carregar".

Utilize as ferramentas de edição para modificar a imagem conforme necessário.

Após concluir as edições, clique em "Guardar" para manter as alterações.

Se desejar descarregar a imagem, selecione "Exportar" e escolha o formato desejado.

Caso escolha a opção de criação de imagens, use o menu de edição e criação de imagens para modificar e deixar a imagem como quiser.

Além disso, também é possível mover as formas geométricas e o texto, além de também haver a possibilidade de mudar a cor do texto.




Manutenção

Para adicionar novas funcionalidades, modifique app.py.

Para atualizar o design, edite styles.css e index.html.

Para depuração, utilize print() no backend ou console.log() no frontend.

Para melhorar a performance, implemente cache no navegador e otimização de imagens.




Segurança

Limitar tipos de ficheiros suportados nos uploads.

Implementar autenticação, caso necessário.

Utilizar HTTPS para comunicação segura.

Verificar tamanho máximo dos ficheiros para evitar ataques de sobrecarga.



Problemas Comuns e Soluções

Erro 500: Verifique os logs para identificar problemas de código.

Não carrega imagens: Confirme permissões da pasta static/uploads/.

CSS não aplica mudanças: Limpe a cache do navegador.

Erro de conexão: Certifique-se de que o servidor Flask está em execução corretamente.

