const express = require("express");
const axios = require("axios");
const fs = require("fs")

const port = 3000;
const app = express();

app.listen(port, () => {
    console.log(`Aplicación ejecutando por el puerto ${port}`);
})

app.get("/pokemons/add", async(req, res) => {
    const idPokemon = req.query.id_pokemon;

    const contentString = fs.readFileSync(`${__dirname}/files/pokemons.txt`,"utf-8");
    const contentJS = JSON.parse(contentString);

    const busqueda = contentJS.find(item => item.id == idPokemon)

    if(busqueda) {
        return res.status(409).json({ message: "No se puede registrar de manera repetida"})
    }

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`);
    contentJS.push(response.data);

    fs.writeFileSync(`${__dirname}/files/pokemons.txt`, JSON.stringify(contentJS),"utf-8")
    res.json({ "message": "Pokemon registrado con éxito", "data": response.data});
})

app.get("/pokemons/list", (req, res) => {
    const contentString = fs.readFileSync(`${__dirname}/files/pokemons.txt`,"utf-8");
    let contentJS = JSON.parse(contentString);
    contentJS = contentJS.map(item => {
        return {
            id: item.id,
            name: item.name,
            order: item.order,
            weight: item.weight,
            height: item.height,
            front_shiny: item?.sprites?.front_shiny || '-'
        }
    })
    res.json({ message: "Listado de pokemons", data: contentJS})
})

app.get("/pokemons/details", (req, res) => {
    const idPokemon = req.query.id_pokemon;
    const contentString = fs.readFileSync(`${__dirname}/files/pokemons.txt`,"utf-8");
    const contentJS = JSON.parse(contentString);

    const busqueda = contentJS.find(item => item.id == idPokemon)

    if(busqueda) {
        res.json({ message: "Datos del pokemon", data: busqueda});
    } else {
        res.status(404).json({ message: "Pokemon no registrado"})
    }
})


