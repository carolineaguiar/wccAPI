const moment = require ('moment');
const conexao = require('../infra/conexao');

class Agendamento {

    listagem(resp){
        const sql = 'SELECT * FROM agendamentos';

        conexao.query(sql, (error, results) => {
            if(error) {
                resp.status(400).json(error)
            }
            resp.status(201).json(results);
        });
    };

    buscaPorId(id, resp) {
        const sql = 'SELECT * FROM agendamentos WHERE id = ?';
        conexao.query(sql, id, (error, result) => {
            if(error) {
                resp.status(400).json(error)
            }
            resp.status(201).json(result);
        });
    };

    alterar(id, valores, resp){
        const sql = 'UPDATE agendamentos SET ? WHERE id = ?';
        
        if(valores.data_servico){
            valores.data_servico = moment(valores.data_servico).format('YYYY-MM-DD');
        }

        conexao.query(sql, [valores, id], (error, result) => {
            if(error) {
                resp.status(400).json(error)
            }
            resp.status(200).json(result)
        })
    };

    remover(id, resp) {
        const sql = `DELETE FROM agendamentos WHERE id = ?`
        
        conexao.query(sql, id, (error, results)=> {
            if(error){
                resp.status(400).json(error)
            }
            resp.status(201).json({
               mensagem: `Agendamento com ${id} removido com sucesso!` 
            })
        });
    };

    inserir(agendamento, resp) {
        const sql = 'INSERT INTO agendamentos SET ?';

        const data_servico = moment(agendamento.data_servico).format('YYYY-MM-DD');
        const data_agendamento = moment().format('YYYY-MM-DD');

        const agendamentoComData = {...agendamento, data_agendamento, data_servico};
        const isDataValida = moment(agendamento.data_servico).isSameOrAfter(data_agendamento);
        const isNomeCliente = agendamento.nome_cliente.length > 2;

        const validaçoes = [
            {
                nome: "data_servico",
                valido: isDataValida,
                mensagem: "Data do agendamento deve ser igual ou posterior a data de hoje"
            },
            {
                nome: "nome_cliente",
                valido: isNomeCliente,
                mensagem: "O nome do cliente deve ter ao menos 3 digitos"
            }
        ];

        const errors = validaçoes.filter(campo => !campo.valido);

        if(errors.length > 0) {
            return resp.status(400).json(errors);
        }

        conexao.query(sql, agendamentoComData, (error, results) =>{
            if(error){
                throw error;
            };

            console.log(results);
        });

    };
};

module.exports = new  Agendamento;